import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls, ContactShadows, Environment, Lightformer, Grid, Html, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import Truck from './Truck'
import { PARTS, PART_MAP, MODEL } from './lessons'

const HOME = { pos: [6.4, 2.8, 6.6], target: [0, 0.8, 0] }
const LESSON_HOME = { pos: [5.2, 3.4, 5.6], target: [0.4, 0.7, 0] }
const NON_LESSON = ['body', 'wheels', 'chassis', 'other']

// ── Resolve which lesson part a mesh belongs to ──────────────────────────────
const MAP_ORDER = Object.keys(PART_MAP).filter(k => k !== 'body').concat('body')
function partFromName(name) {
  const n = (name || '').toLowerCase()
  if (!n) return null
  if (PARTS[name] || NON_LESSON.includes(name)) return name // procedural model uses ids directly
  for (const id of MAP_ORDER) if (PART_MAP[id].some(t => n.startsWith(t.toLowerCase()) || n.includes(t.toLowerCase()))) return id
  return null
}
function resolvePart(obj) {
  for (let o = obj; o; o = o.parent) { const p = partFromName(o.name); if (p) return p; if (o.userData?.modelRoot) break }
  return 'other'
}

// ── Models ───────────────────────────────────────────────────────────────────
function GlbModel({ url, rotation, onReady }) {
  const { scene } = useGLTF(url)
  const wrap = useMemo(() => {
    const inner = scene; inner.rotation.set(...rotation); inner.position.set(0, 0, 0); inner.scale.set(1, 1, 1)
    const w = new THREE.Group(); w.add(inner); w.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(inner), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
    const s = MODEL.length / Math.max(size.x, size.z, 1e-6)
    inner.position.set(-c.x * s, -box.min.y * s, -c.z * s); inner.scale.setScalar(s)
    inner.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
    return w
  }, [scene, rotation])
  useEffect(() => { onReady(url + rotation.join()) }, [wrap])
  return <primitive object={wrap} />
}
function ProceduralModel({ onReady }) {
  useEffect(() => { onReady('procedural') }, [])
  return <Truck />
}

class Boundary extends Component {
  state = { err: null }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(e) { this.props.onError?.(e) }
  render() { return this.state.err ? this.props.fallback : this.props.children }
}

// ── Scene ────────────────────────────────────────────────────────────────────
function Scene({ nonce, modelUrl, rotation, focus, also, xray, accent, spin, inspect, onInspect, onModelError, inLesson }) {
  const root = useRef(), cam = useRef()
  const [ready, setReady] = useState(null)
  const [labels, setLabels] = useState([])
  const index = useRef([])
  const glow = useMemo(() => new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 2, toneMapped: false, metalness: 0.2, roughness: 0.4 }), [accent])
  const ghosts = useRef(new Map())

  const ghostOf = (m, part) => {
    const key = m.uuid + (NON_LESSON.includes(part) ? 'b' : 'p')
    if (!ghosts.current.has(key)) {
      const g = m.clone(); g.transparent = true; g.depthWrite = false
      g.opacity = NON_LESSON.includes(part) ? 0.07 : 0.25
      if (g.emissive && !NON_LESSON.includes(part)) g.emissive = new THREE.Color('#1d3a5c')
      ghosts.current.set(key, g)
    }
    return ghosts.current.get(key)
  }

  // index meshes → part
  useEffect(() => {
    if (!ready || !root.current) return
    root.current.userData.modelRoot = true
    const list = []
    root.current.traverse(o => { if (o.isMesh) { o.userData.orig ||= o.material; list.push({ mesh: o, part: resolvePart(o) }) } })
    index.current = list
  }, [ready])

  // materials: glow focus, ghost the rest in x-ray
  useEffect(() => {
    for (const { mesh, part } of index.current) {
      const orig = mesh.userData.orig
      if (focus.includes(part)) mesh.material = Array.isArray(orig) ? orig.map(() => glow) : glow
      else if (xray && !also.includes(part)) mesh.material = Array.isArray(orig) ? orig.map(m => ghostOf(m, part)) : ghostOf(orig, part)
      else mesh.material = orig
    }
  }, [focus.join(), also.join(), xray, ready, glow])

  // camera + labels
  useEffect(() => {
    if (!ready || !cam.current) return
    if (!spin) { root.current.rotation.y = 0; root.current.updateMatrixWorld(true) }
    const boxOf = (ids) => {
      const b = new THREE.Box3()
      index.current.filter(x => ids.includes(x.part)).forEach(x => b.expandByObject(x.mesh))
      return b.isEmpty() ? null : b
    }
    const lbl = []
    ;[...focus.map(id => [id, true]), ...also.map(id => [id, false])].forEach(([id, primary]) => {
      const b = boxOf([id]); if (!b) return
      const c = b.getCenter(new THREE.Vector3())
      lbl.push({ id, primary, pos: [c.x, b.max.y + 0.12, c.z] })
    })
    setLabels(lbl)
    const fb = focus.length && boxOf(focus)
    if (fb) {
      const c = fb.getCenter(new THREE.Vector3()), size = fb.getSize(new THREE.Vector3()).length()
      const p = PARTS[focus[0]] || { dir: [1, 0.6, 1], dist: 3 }
      const dist = Math.max(p.dist * 1.2, size * 2)
      const d = new THREE.Vector3(...p.dir).normalize().multiplyScalar(dist)
      cam.current.setLookAt(c.x + d.x, c.y + d.y, c.z + d.z, c.x, c.y, c.z, true)
      // push the part up-right on screen so the floating note doesn't cover it
      const wide = window.innerWidth > 900
      cam.current.setFocalOffset(wide ? -dist * 0.16 : 0, dist * (wide ? 0.08 : 0.05), 0, true)
    } else {
      const v = inLesson ? LESSON_HOME : HOME
      cam.current.setLookAt(...v.pos, ...v.target, true)
      cam.current.setFocalOffset(0, 0, 0, true)
    }
  }, [focus.join(), also.join(), ready, spin, inLesson, nonce])

  useFrame(({ clock }, dt) => {
    glow.emissiveIntensity = 1.3 + Math.sin(clock.elapsedTime * 4) * 0.9
    if (spin && root.current) root.current.rotation.y += dt * 0.22
  })

  return (
    <>
      <group ref={root}>
        <Boundary key={modelUrl || 'p'} onError={onModelError} fallback={<ProceduralModel onReady={setReady} />}>
          <Suspense fallback={<Html center><div className="loading">Loading model…</div></Html>}>
            {modelUrl ? <GlbModel url={modelUrl} rotation={rotation} onReady={setReady} /> : <ProceduralModel onReady={setReady} />}
          </Suspense>
        </Boundary>
      </group>
      {labels.map(l => (
        <Html key={l.id + l.primary} position={l.pos} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div className={'tag' + (l.primary ? ' primary' : '')} style={{ '--c': accent }}>
            <i />{PARTS[l.id]?.name || l.id}
          </div>
        </Html>
      ))}
      <CameraControls ref={cam} minDistance={1.2} maxDistance={16} maxPolarAngle={Math.PI / 1.9} smoothTime={0.55} />
    </>
  )
}

export default function Viewer(props) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: HOME.pos, fov: 35 }}>
      <color attach="background" args={['#0c0f14']} />
      <fog attach="fog" args={['#0c0f14', 13, 28]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 4]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-6, 5, -4]} intensity={40} angle={0.5} penumbra={1} color="#7fb3ff" />
      <Environment resolution={256} environmentIntensity={1.3}>
        <Lightformer intensity={2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer intensity={1.5} position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={1.5} position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} color="#ffd9a8" />
      </Environment>
      <Scene {...props} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.65} scale={12} blur={2.4} far={3} />
      <Grid args={[30, 30]} cellSize={0.5} cellThickness={0.6} cellColor="#19202b" sectionSize={2.5} sectionThickness={1} sectionColor={props.xray ? '#244b72' : '#232d3b'} fadeDistance={22} infiniteGrid />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.9} />
        <Vignette darkness={0.5} offset={0.25} />
      </EffectComposer>
    </Canvas>
  )
}
