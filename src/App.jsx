import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cog, Thermometer, Fuel, Wind, Zap, Settings2, Disc, CloudFog, Flame, Droplets, Gauge, BatteryLow,
  Scan, RotateCcw, ChevronLeft, ChevronRight, Check, Lightbulb, X, Layers,
} from 'lucide-react'
import Viewer from './Viewer'
import logo from './assets/logo.png'
import { SYSTEM_LESSONS, FAULT_LESSONS, PARTS, MODEL } from './lessons'

const ICONS = { Cog, Thermometer, Fuel, Wind, Zap, Settings2, Disc, CloudFog, Flame, Droplets, Gauge, BatteryLow }
const ALL = [...SYSTEM_LESSONS, ...FAULT_LESSONS]
const SEV = { high: 'Critical', medium: 'Warning', low: 'Advisory' }

function loadDone() { try { return new Set(JSON.parse(localStorage.getItem('revo-done') || '[]')) } catch { return new Set() } }
function saveDone(s) { try { localStorage.setItem('revo-done', JSON.stringify([...s])) } catch {} }

export default function App() {
  const [tab, setTab] = useState('systems')
  const [lessonId, setLessonId] = useState(null)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('learn')
  const [pick, setPick] = useState(null)
  const [done, setDone] = useState(loadDone)
  const [xrayPref, setXrayPref] = useState(null)
  const [modelUrl, setModelUrl] = useState(null)
  const rotation = MODEL.rotation
  const [nonce, setNonce] = useState(0)

  const lesson = ALL.find(l => l.id === lessonId)
  const s = lesson && phase === 'learn' ? lesson.steps[step] : null
  const xray = xrayPref ?? !!lesson
  const focus = s?.focus || []
  const also = s?.also || []

  // Auto-load /public/models/revo.glb if it exists
  useEffect(() => {
    fetch(MODEL.url, { method: 'HEAD' }).then(r => {
      const t = r.headers.get('content-type') || ''
      if (r.ok && !t.includes('html')) setModelUrl(MODEL.url)
    }).catch(() => {})
  }, [])

  const open = (id) => { setLessonId(id); setStep(0); setPhase('learn'); setPick(null); setXrayPref(null) }
  const close = () => { setLessonId(null); setPhase('learn'); setXrayPref(null) }
  const next = () => step < lesson.steps.length - 1 ? setStep(step + 1) : (setPhase('quiz'), setPick(null))
  const answer = (i) => {
    setPick(i)
    if (i === lesson.quiz.answer) { const n = new Set(done); n.add(lesson.id); setDone(n); saveDone(n) }
  }
  const list = tab === 'systems' ? SYSTEM_LESSONS : FAULT_LESSONS
  const accent = lesson?.color || '#ffb020'

  return (
    <div className="app" style={{ '--accent': accent }}>
      {/* ───────── Left: lesson cards ───────── */}
      <aside className="side">
        <header className="brand">
          <div className="mark"><img src={logo} alt="M.A.N Tech" /></div>
          <div><b>Revo Academy</b><span>by M.A.N Tech · Hilux Revo D/C</span></div>
        </header>
        <div className="progress">
          <div className="ptxt"><span>Course progress</span><b>{done.size} / {ALL.length} lessons</b></div>
          <div className="pbar"><i style={{ width: `${(done.size / ALL.length) * 100}%` }} /></div>
        </div>
        <nav className="seg">
          <button className={tab === 'systems' ? 'on' : ''} onClick={() => setTab('systems')}><Layers size={14} />Systems <em>{SYSTEM_LESSONS.length}</em></button>
          <button className={tab === 'faults' ? 'on' : ''} onClick={() => setTab('faults')}><Flame size={14} />Fault lessons <em>{FAULT_LESSONS.length}</em></button>
        </nav>
        <div className="cards">
          {list.map((l, i) => {
            const I = ICONS[l.icon] || Cog
            return (
              <motion.button key={l.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className={'card' + (l.id === lessonId ? ' sel' : '')} style={{ '--c': l.color }} onClick={() => open(l.id)}>
                <span className="ico"><I size={18} /></span>
                <span className="ctext">
                  {l.kind === 'fault' && <span className="code">{l.code} · {SEV[l.severity]}</span>}
                  <b>{l.title}</b>
                  <small>{l.sub}</small>
                  <span className="cmeta">{l.steps.length} steps · {l.mins} min · quiz</span>
                </span>
                {done.has(l.id) ? <span className="tick"><Check size={13} /></span> : <ChevronRight size={16} className="chev" />}
              </motion.button>
            )
          })}
        </div>
        <footer className="side-foot">Training content compiled from public sources. Verify against the Toyota workshop manual.</footer>
      </aside>

      {/* ───────── Right: 3D model with floating notes ───────── */}
      <main className="stage">
        <Viewer modelUrl={modelUrl} rotation={rotation} focus={focus} also={also} xray={xray} accent={accent}
          spin={!lesson} inspect={false} onInspect={() => {}} inLesson={!!lesson} nonce={nonce}
          onModelError={() => setModelUrl(null)} />
        {xray && <div className="scan" />}

        <AnimatePresence mode="wait">
          {lesson ? (
            <motion.div key={lesson.id} className="heading" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <button className="back" onClick={close}><ChevronLeft size={14} /> All lessons</button>
              <span className="eyebrow">{lesson.kind === 'fault' ? `Fault lesson · ${lesson.code}` : 'System lesson'}</span>
              <h1>{lesson.title}</h1>
              {lesson.kind === 'fault' && (
                <div className="flow">
                  {lesson.steps.map((x, i) => <span key={i} className={phase === 'learn' && i === step ? 'on' : (i < step || phase === 'quiz') ? 'past' : ''}>{x.label}</span>)}
                  <span className={phase === 'quiz' ? 'on' : ''}>Quiz</span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="idle" className="heading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="eyebrow">Interactive vehicle trainer</span>
              <h1>Toyota Hilux Revo<br />Double Cabin</h1>
              <div className="facts">
                <span><b>2,755</b> cc</span><span><b>500</b> Nm</span><span><b>6</b>-speed</span><span><b>4WD</b> hi/lo</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="tools">
          <button className={xray ? 'on' : ''} onClick={() => setXrayPref(!xray)} title="See through the body"><Scan size={15} /><span>X-ray</span></button>
          <button onClick={() => setNonce(nonce + 1)} title="Reset camera"><RotateCcw size={15} /></button>
        </div>

        {!lesson && (
          <div className="note idle">
            <b>Pick a lesson to begin</b>
            <p>Each lesson moves the camera to the real component, highlights it, and walks through how it works or how to fix it. Each one ends with a quick quiz.</p>
            <div className="hintrow"><span>Drag to orbit</span><span>Scroll to zoom</span><span>X-ray to see inside</span></div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {lesson && phase === 'learn' && (
            <motion.div key={lesson.id + step} className="note" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <div className="nhead">
                <span className="pill">{s.label || `Step ${step + 1} of ${lesson.steps.length}`}</span>
                <span className="parts">{focus.map(id => PARTS[id]?.name).join(' · ')}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {s.tip && <div className="tip"><Lightbulb size={14} /><span>{s.tip}</span></div>}
              <div className="nfoot">
                <div className="dots">{lesson.steps.map((_, i) => <i key={i} className={i === step ? 'on' : i < step ? 'past' : ''} onClick={() => setStep(i)} />)}</div>
                <div className="navs">
                  <button disabled={step === 0} onClick={() => setStep(step - 1)} aria-label="Previous step"><ChevronLeft size={15} /></button>
                  <button className="primary" onClick={next}>{step === lesson.steps.length - 1 ? 'Take the quiz' : 'Next'} <ChevronRight size={15} /></button>
                </div>
              </div>
            </motion.div>
          )}
          {lesson && phase === 'quiz' && (
            <motion.div key={lesson.id + 'quiz'} className="note" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="nhead"><span className="pill">Check yourself</span></div>
              <h3>{lesson.quiz.q}</h3>
              <div className="opts">
                {lesson.quiz.options.map((o, i) => {
                  const st = pick === null ? '' : i === lesson.quiz.answer && pick === i ? 'right' : i === pick ? 'wrong' : ''
                  return <button key={i} className={st} disabled={pick === lesson.quiz.answer} onClick={() => answer(i)}>{o}{st === 'right' && <Check size={15} />}{st === 'wrong' && <X size={15} />}</button>
                })}
              </div>
              {pick !== null && <p className={'verdict ' + (pick === lesson.quiz.answer ? 'ok' : 'no')}>{pick === lesson.quiz.answer ? 'Correct. Lesson complete.' : 'Not quite. Try another answer.'}</p>}
              <div className="nfoot">
                <button className="ghostbtn" onClick={() => { setPhase('learn'); setStep(0) }}><RotateCcw size={14} /> Replay</button>
                {pick === lesson.quiz.answer && (() => {
                  const arr = lesson.kind === 'fault' ? FAULT_LESSONS : SYSTEM_LESSONS
                  const nxt = arr[arr.findIndex(l => l.id === lesson.id) + 1]
                  return nxt ? <button className="primary" onClick={() => open(nxt.id)}>Next lesson <ChevronRight size={15} /></button> : <button className="primary" onClick={close}>Finish <Check size={15} /></button>
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  )
}
