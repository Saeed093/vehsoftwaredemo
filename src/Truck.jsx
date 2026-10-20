import { useMemo } from 'react'
import * as THREE from 'three'

// Placeholder Hilux Revo double cab built from primitives (used until your CAD/GLB is loaded).
// Units ≈ metres. +X = front, Y = up. Each lesson part is a <group name="partId">.

const WX = 1.54, TRACK = 0.8, R = 0.38

const M = {
  paint: () => new THREE.MeshPhysicalMaterial({ color: '#e6e8eb', metalness: 0.5, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.15 }),
  glass: () => new THREE.MeshPhysicalMaterial({ color: '#0d1117', metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.85 }),
  trim: () => new THREE.MeshStandardMaterial({ color: '#1a1b1e', roughness: 0.6 }),
  metal: () => new THREE.MeshStandardMaterial({ color: '#555a62', metalness: 0.8, roughness: 0.35 }),
  dark: () => new THREE.MeshStandardMaterial({ color: '#2a2c31', metalness: 0.5, roughness: 0.5 }),
  tire: () => new THREE.MeshStandardMaterial({ color: '#141414', roughness: 0.9 }),
  rim: () => new THREE.MeshStandardMaterial({ color: '#8c9097', metalness: 0.9, roughness: 0.25 }),
  col: (c, m = 0.6, r = 0.4) => new THREE.MeshStandardMaterial({ color: c, metalness: m, roughness: r }),
  light: (c, i) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, toneMapped: false }),
}

function archShape(pts, cx, y0) {
  const s = new THREE.Shape(); const a = Math.asin((y0 - R) / 0.46)
  s.moveTo(pts[0][0], pts[0][1]); s.lineTo(cx - 0.46 * Math.cos(a), y0)
  s.absarc(cx, R, 0.46, Math.PI - a, a, true)
  pts.slice(1).forEach(([x, y]) => s.lineTo(x, y)); s.closePath(); return s
}
function ext(shape, depth, bevel = 0.025) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 32 })
  g.translate(0, 0, -depth / 2); return g
}
function poly(pts) { const s = new THREE.Shape(); s.moveTo(...pts[0]); pts.slice(1).forEach(p => s.lineTo(...p)); s.closePath(); return s }

const Box = ({ p, s, m, r }) => <mesh position={p} rotation={r} material={m} castShadow><boxGeometry args={s} /></mesh>
const Cyl = ({ p, r = [0, 0, 0], a, m }) => <mesh position={p} rotation={r} material={m} castShadow><cylinderGeometry args={a} /></mesh>

export default function Truck() {
  const mat = useMemo(() => ({
    paint: M.paint(), glass: M.glass(), trim: M.trim(), metal: M.metal(), dark: M.dark(), tire: M.tire(), rim: M.rim(),
    block: M.col('#6a7079', 0.7, 0.4), turbo: M.col('#b0703f', 0.8, 0.35), alu: M.col('#a7adb5', 0.9, 0.3),
    gold: M.col('#c9a227', 0.5, 0.4), red: M.col('#b3261e', 0.3, 0.5), batt: M.col('#26282c', 0.2, 0.6),
    head: M.light('#d8ecff', 2.2), tail: M.light('#ff2020', 1.4),
  }), [])
  const geo = useMemo(() => ({
    lower: ext(archShape([[-0.45, 0.55], [2.5, 0.55], [2.66, 0.72], [2.64, 1.05], [2.45, 1.14], [1.4, 1.19], [-0.45, 1.19]], WX, 0.55), 1.8, 0.03),
    green: ext(poly([[-0.42, 1.18], [1.34, 1.18], [0.98, 1.8], [-0.38, 1.82]]), 1.66),
    win: ext(poly([[-0.32, 1.26], [1.2, 1.26], [0.93, 1.72], [-0.3, 1.73]]), 1.7),
    bedSide: ext(archShape([[-2.65, 0.62], [-0.5, 0.62], [-0.5, 1.2], [-2.65, 1.2]], -WX, 0.62), 0.07, 0.015),
  }), [])
  const { paint, glass, trim, metal, dark } = mat

  return (
    <group>
      <group name="body">
        <mesh geometry={geo.lower} material={paint} castShadow />
        <mesh geometry={geo.green} material={paint} castShadow />
        <mesh geometry={geo.win} material={glass} />
        <Box p={[1.169, 1.495, 0]} r={[0, 0, 0.526]} s={[0.02, 0.64, 1.5]} m={glass} />
        <Box p={[-0.44, 1.5, 0]} s={[0.02, 0.36, 1.3]} m={glass} />
        <Box p={[0.42, 1.49, 0]} s={[0.09, 0.5, 1.72]} m={paint} />
        {[1, -1].map(s => <group key={s}>
          <mesh geometry={geo.bedSide} material={paint} position={[0, 0, s * 0.87]} castShadow />
          <Box p={[0.42, 0.88, s * 0.935]} s={[0.012, 0.6, 0.01]} m={trim} />
          <Box p={[-0.75, 1.42, s * 0.8]} s={[0.06, 0.45, 0.06]} m={trim} />
          <Box p={[2.6, 1.0, s * 0.7]} s={[0.1, 0.1, 0.34]} m={mat.head} />
          <Box p={[-2.66, 1.0, s * 0.8]} s={[0.04, 0.26, 0.12]} m={mat.tail} />
          <Box p={[1.18, 1.28, s * 1.0]} s={[0.16, 0.12, 0.14]} m={trim} />
        </group>)}
        <Box p={[-0.53, 0.92, 0]} s={[0.07, 0.56, 1.74]} m={paint} />
        <Box p={[-2.62, 0.92, 0]} s={[0.07, 0.56, 1.74]} m={paint} />
        <Box p={[-1.58, 0.82, 0]} s={[2.06, 0.04, 1.68]} m={trim} />
        <Box p={[-0.75, 1.64, 0]} s={[0.06, 0.06, 1.66]} m={trim} />
        <Box p={[2.6, 0.62, 0]} s={[0.22, 0.26, 1.84]} m={trim} />
        <Box p={[2.67, 0.92, 0]} s={[0.04, 0.24, 1.0]} m={trim} />
      </group>

      <group name="chassis">
        {[0.45, -0.45].map(z => <Box key={z} p={[0, 0.48, z]} s={[4.9, 0.14, 0.07]} m={metal} />)}
      </group>

      <group name="wheels">
        {[[WX, 1], [WX, -1], [-WX, 1], [-WX, -1]].map(([x, s]) => (
          <group key={x + '' + s} position={[x, R, s * TRACK]}>
            <Cyl r={[Math.PI / 2, 0, 0]} a={[R, R, 0.27, 40]} m={mat.tire} />
            <Cyl p={[0, 0, s * 0.137]} r={[Math.PI / 2, 0, 0]} a={[0.24, 0.24, 0.01, 32]} m={mat.rim} />
          </group>
        ))}
      </group>

      <group name="brakes">
        {[1, -1].map(s => <group key={s} position={[WX, R, s * (TRACK - 0.17)]}>
          <Cyl r={[Math.PI / 2, 0, 0]} a={[0.2, 0.2, 0.03, 32]} m={mat.alu} />
          <Box p={[0.14, 0.12, 0]} s={[0.1, 0.14, 0.08]} m={mat.red} />
        </group>)}
      </group>
      <group name="rearBrakes">
        {[1, -1].map(s => <Cyl key={s} p={[-WX, R, s * (TRACK - 0.19)]} r={[Math.PI / 2, 0, 0]} a={[0.18, 0.18, 0.1, 28]} m={dark} />)}
      </group>

      <group name="axles">
        {[WX, -WX].map(x => <group key={x}>
          <Cyl p={[x, R, 0]} r={[Math.PI / 2, 0, 0]} a={[0.05, 0.05, 1.3, 12]} m={metal} />
          <mesh position={[x, R, 0.05]} material={metal}><sphereGeometry args={[0.13, 20, 16]} /></mesh>
        </group>)}
      </group>

      <group name="engine">
        <Box p={[1.85, 0.8, 0]} s={[0.7, 0.48, 0.58]} m={mat.block} />
        <Box p={[1.85, 1.08, 0]} s={[0.62, 0.08, 0.44]} m={dark} />
      </group>
      <group name="injectors">
        {[0, 1, 2, 3].map(i => <Cyl key={i} p={[1.62 + i * 0.15, 1.15, 0.05]} a={[0.025, 0.025, 0.08, 10]} m={mat.alu} />)}
        <Cyl p={[1.85, 1.17, -0.06]} r={[0, 0, Math.PI / 2]} a={[0.02, 0.02, 0.55, 10]} m={mat.alu} />
      </group>
      <group name="egr" position={[1.68, 1.13, 0.2]}>
        <Box s={[0.18, 0.1, 0.14]} m={mat.alu} />
        <Cyl p={[0.18, 0, 0]} r={[0, 0, Math.PI / 2]} a={[0.03, 0.03, 0.2, 10]} m={mat.alu} />
      </group>
      <group name="turbo" position={[1.75, 0.95, -0.4]}>
        <Cyl r={[Math.PI / 2, 0, 0]} a={[0.12, 0.12, 0.12, 24]} m={mat.turbo} />
        <Cyl p={[0.12, 0, 0.02]} r={[0, 0, Math.PI / 2]} a={[0.06, 0.06, 0.16, 16]} m={mat.alu} />
      </group>
      <group name="radiator" position={[2.45, 0.88, 0]}>
        <Box s={[0.06, 0.46, 1.3]} m={dark} />
        <Cyl p={[-0.12, 0, 0]} r={[0, 0, Math.PI / 2]} a={[0.2, 0.2, 0.05, 24]} m={trim} />
      </group>
      <group name="battery" position={[2.05, 1.0, -0.62]}>
        <Box s={[0.26, 0.2, 0.17]} m={mat.batt} />
        <Box p={[0, 0.11, 0]} s={[0.26, 0.02, 0.17]} m={mat.alu} />
      </group>
      <group name="alternator" position={[2.18, 0.72, 0.32]}>
        <Cyl r={[Math.PI / 2, 0, 0]} a={[0.08, 0.08, 0.14, 20]} m={mat.alu} />
      </group>
      <group name="fuelFilter" position={[1.35, 0.85, 0.62]}>
        <Cyl a={[0.065, 0.065, 0.2, 20]} m={mat.gold} />
        <Cyl p={[0, 0.12, 0]} a={[0.07, 0.07, 0.04, 20]} m={trim} />
      </group>
      <group name="tank" position={[-0.9, 0.56, -0.68]}>
        <Box s={[0.9, 0.26, 0.28]} m={dark} />
      </group>

      <group name="gearbox" position={[1.2, 0.66, 0]}>
        <Box s={[0.5, 0.3, 0.3]} m={mat.block} />
      </group>
      <group name="transfer" position={[0.75, 0.56, -0.05]}>
        <Box s={[0.3, 0.24, 0.28]} m={mat.block} />
      </group>
      <group name="propshaft">
        <Cyl p={[-0.4, 0.45, 0]} r={[0, 0, Math.PI / 2 - 0.05]} a={[0.035, 0.035, 2.2, 12]} m={metal} />
        <Cyl p={[1.15, 0.43, -0.12]} r={[0, 0, Math.PI / 2]} a={[0.03, 0.03, 0.75, 12]} m={metal} />
      </group>

      <group name="exhaust">
        <Cyl p={[1.25, 0.62, 0.25]} r={[0, 0, 0.9]} a={[0.035, 0.035, 0.6, 10]} m={metal} />
        <Cyl p={[-1.2, 0.42, 0.25]} r={[0, 0, Math.PI / 2]} a={[0.035, 0.035, 2.5, 10]} m={metal} />
      </group>
      <group name="fifthInjector" position={[1.08, 0.54, 0.25]}>
        <Cyl a={[0.03, 0.03, 0.12, 12]} m={mat.gold} />
      </group>
      <group name="dpf" position={[0.35, 0.42, 0.25]}>
        <Cyl r={[0, 0, Math.PI / 2]} a={[0.13, 0.13, 0.6, 24]} m={mat.alu} />
      </group>
      <group name="muffler" position={[-1.7, 0.42, 0.25]}>
        <Cyl r={[0, 0, Math.PI / 2]} a={[0.1, 0.1, 0.45, 20]} m={metal} />
      </group>
    </group>
  )
}
