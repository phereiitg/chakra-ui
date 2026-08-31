import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Guide from './Guide.jsx'
import { ACTS } from './steps.jsx'

/**
 * The staircase, made literal.
 *
 *   ACTS run left to right along the top       →  a new topic
 *   STEPS run top to bottom in the left rail    ↓  another step in this topic
 *
 * and the content animates on the matching axis: sliding up from below when
 * you go down, in from the side when you change topic. The axis you travelled
 * is the axis the screen moves on, which is the only way that mapping becomes
 * obvious without a caption explaining it.
 *
 * The left rail holds the act, the title, the narration and the controls, so
 * everything a judge reads is in one column and the visual owns the rest.
 */
export default function Deck() {
  const [a, setA] = useState(0)
  const [s, setS] = useState(0)
  const [dir, setDir] = useState('down')
  // A judge should never have to hunt for the control. On the very first step
  // an arrow points at it until they move.
  const [showPointer, setShowPointer] = useState(true)

  const act = ACTS[a]
  const step = act.steps[s]
  const tint = step.tint || act.tint
  const lastInAct = s === act.steps.length - 1
  const lastAct = a === ACTS.length - 1

  const flat = useMemo(
    () => ACTS.slice(0, a).reduce((n, x) => n + x.steps.length, 0) + s, [a, s])
  const total = useMemo(() => ACTS.reduce((n, x) => n + x.steps.length, 0), [])

  const goStep = (i) => { setDir(i > s ? 'down' : 'up'); setS(i) }
  const goAct = (i) => { setDir(i > a ? 'right' : 'left'); setA(i); setS(0) }

  // Always advances. At the very end it returns to the start rather than
  // dead-ending on a disabled control.
  const fwd = useCallback(() => {
    setShowPointer(false)
    if (!lastInAct) { setDir('down'); setS((v) => v + 1) }
    else if (!lastAct) { setDir('right'); setA((v) => v + 1); setS(0) }
    else { setDir('right'); setA(0); setS(0) }
  }, [lastInAct, lastAct])

  const back = useCallback(() => {
    if (s > 0) { setDir('up'); setS((v) => v - 1) }
    else if (a > 0) { setDir('left'); setA((v) => v - 1); setS(0) }
  }, [s, a])

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key
      if (k === 'ArrowDown') { e.preventDefault(); if (!lastInAct) { setDir('down'); setS((v) => v + 1) } }
      if (k === 'ArrowUp')   { e.preventDefault(); if (s > 0) { setDir('up'); setS((v) => v - 1) } }
      if (k === 'ArrowRight'){ e.preventDefault(); if (!lastAct) goAct(a + 1) }
      if (k === 'ArrowLeft') { e.preventDefault(); if (a > 0) goAct(a - 1) }
      if (k === 'Enter' || k === ' ') { e.preventDefault(); fwd() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [a, s, lastInAct, lastAct, fwd])

  // The visual travels on the same axis the judge did.
  // The vertical move is deliberately big. A small nudge reads as a fade; a
  // whole panel travelling out of the top while the next one climbs from the
  // bottom is what makes "down" mean something.
  const enter = { down: { y: 190, x: 0, scale: 0.97 }, up: { y: -190, x: 0, scale: 0.97 },
                  right: { y: 0, x: 130, scale: 0.97 }, left: { y: 0, x: -130, scale: 0.97 } }[dir]
  const exit  = { down: { y: -190, x: 0, scale: 0.97 }, up: { y: 190, x: 0, scale: 0.97 },
                  right: { y: 0, x: -130, scale: 0.97 }, left: { y: 0, x: 130, scale: 0.97 } }[dir]

  const nextLabel = lastInAct ? (lastAct ? 'Start over' : ACTS[a + 1].name) : 'Next'

  return (
    <div className="h-screen w-screen overflow-hidden relative select-none flex flex-col">

      {/* ---------------- ambient ---------------- */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div className="lamp"
          animate={{ background: `radial-gradient(circle, ${act.tint}4D, transparent 66%)` }}
          transition={{ duration: 1.1 }}
          style={{ width: 820, height: 820, left: '-6%', top: '-24%', opacity: .32 }} />
        <motion.div className="lamp animate-drift"
          animate={{ background: `radial-gradient(circle, ${tint}3D, transparent 66%)` }}
          transition={{ duration: 1.1 }}
          style={{ width: 680, height: 680, right: '-10%', bottom: '-22%', opacity: .26 }} />
      </div>

      {/* ═══════════ acts · horizontal, the → axis ═══════════ */}
      <header className="shrink-0 px-8 pt-5 pb-4 border-b border-line
                         bg-bg/70 backdrop-blur-xl z-30">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet to-rose
                          flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full border-[1.5px] border-white/90" />
          </div>
          <span className="font-display font-semibold text-[14px] tracking-tight">Chakra</span>
          <span className="label">adversarial range for payment security</span>
          <span className="label ml-auto mono">{String(flat + 1).padStart(2, '0')} / {total}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {ACTS.map((A, ai) => {
            const here = ai === a, past = ai < a
            return (
              <button key={A.name} onClick={() => goAct(ai)}
                className="flex-1 min-w-0 text-left group">
                <motion.div
                  animate={{ opacity: here ? 1 : past ? 0.6 : 0.34 }}
                  className="px-3 py-2 rounded-xl border transition-colors"
                  style={{
                    borderColor: here ? `${A.tint}66` : 'rgba(255,255,255,.06)',
                    background: here ? `${A.tint}14` : 'transparent',
                    boxShadow: here ? `0 0 28px -12px ${A.tint}` : 'none',
                  }}>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[9.5px] tracking-[0.14em]"
                          style={{ color: here ? A.tint : '#5A6070' }}>
                      {String(ai + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-[12.5px] truncate leading-tight
                                      ${here ? 'text-txt font-medium' : 'text-dim'}`}>
                      {A.name}
                    </span>
                  </div>
                  {/* how far through this act */}
                  <div className="h-[2px] rounded-full bg-white/[0.07] mt-2 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: A.tint }}
                      animate={{ width: here ? `${((s + 1) / A.steps.length) * 100}%`
                                            : past ? '100%' : '0%' }}
                      transition={{ duration: 0.35 }} />
                  </div>
                </motion.div>
              </button>
            )
          })}
        </div>
      </header>

      {/* ═══════════ body ═══════════ */}
      <div className="flex-1 min-h-0 flex">

        {/* ---- left rail: steps ↓, title, narration, controls ---- */}
        <aside className="w-[400px] shrink-0 border-r border-line flex flex-col
                          px-7 py-7 relative">

          {/* Fixed height so the controls below never move as narration grows.
              A button that walks down the page is one a judge has to hunt for
              on every step. */}
          <div className="flex gap-5 h-[420px] overflow-y-auto pr-1">
            {/* the ↓ axis, as a literal vertical ladder */}
            <div className="flex flex-col items-center gap-2 pt-1.5 shrink-0">
              {act.steps.map((st, si) => {
                const on = si === s, seen = si < s
                return (
                  <button key={st.id} onClick={() => goStep(si)} aria-label={st.label}
                          className="flex flex-col items-center gap-2 group">
                    <motion.span className="rounded-full"
                      animate={{ width: 7, height: on ? 20 : 7,
                                 opacity: on ? 1 : seen ? 0.55 : 0.18 }}
                      transition={{ duration: 0.28 }}
                      style={{ background: on || seen ? act.tint : '#FFFFFF' }} />
                    {si < act.steps.length - 1 && (
                      <span className="w-px h-2.5"
                            style={{ background: seen ? `${act.tint}55` : 'rgba(255,255,255,.08)' }} />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div key={step.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
                  <div className="mono text-[10px] tracking-[0.16em] uppercase mb-2.5"
                       style={{ color: tint }}>{step.label}</div>
                  <h2 className="font-display font-semibold text-[26px] tracking-[-0.035em]
                                 leading-[1.1] mb-5">{step.title}</h2>
                  <Guide text={step.guide} tint={tint} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ---- controls, pinned ---- */}
          <div className="shrink-0 pt-5 mt-auto border-t border-line">
            <div className="flex items-center gap-2.5">
              <button onClick={back} disabled={a === 0 && s === 0} aria-label="previous"
                      className="w-10 h-10 rounded-full border border-line text-dim shrink-0
                                 hover:text-txt hover:bg-white/[0.06] transition-colors
                                 disabled:opacity-20">←</button>
              <motion.button onClick={fwd}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex-1 h-10 rounded-full font-medium text-[13px] px-4
                           flex items-center justify-between gap-2"
                style={{ background: `${tint}22`, color: tint, border: `1px solid ${tint}55` }}>
                <span className="truncate">{nextLabel}</span>
                <span className="shrink-0">{lastInAct ? '→' : '↓'}</span>
              </motion.button>
            </div>
            <div className="label mt-3">
              ↓ next step · → next section · enter to go forward
            </div>

            {showPointer && a === 0 && s === 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 mt-4">
                <motion.span
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-[26px] leading-none" style={{ color: tint }}>↑</motion.span>
                <span className="text-[13px]" style={{ color: tint }}>
                  press this, or the arrow keys, to walk through
                </span>
              </motion.div>
            )}
          </div>
        </aside>

        {/* ---- stage ---- */}
        <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7">
          <AnimatePresence mode="wait">
            <motion.div key={`${a}-${s}`}
              initial={{ opacity: 0, ...enter }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, ...exit }}
              transition={{ duration: 0.52, ease: [0.16, 0.84, 0.24, 1] }}
              className="w-full">
              {step.render()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
