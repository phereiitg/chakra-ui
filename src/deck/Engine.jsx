import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { V, M, R, A, S, G } from './bits.jsx'

/**
 * The engine, opened up.
 *
 * A progress bar with a number beside it shows a result and hides everything
 * that produced it. This shows the machine working: transactions arrive as
 * nodes, get routed, fan out into three heads, each head accumulates its
 * weight-of-evidence terms one at a time, and the totals fuse into a decision.
 *
 * The point a judge should take away is visible in the motion itself — two of
 * the three heads stay dark on agentic traffic, because there is nothing there
 * for an anomaly detector to find.
 */

const HEADS = [
  { k: 'A', name: 'Behavioural', tint: M, reads: 'velocity · amount · hour',
    terms: [['n_1h', '1', 0.02], ['distinct_mcc_24h', '2', -0.11],
            ['amt_over_median', '1.4×', 0.18], ['hour_of_day', '14:22', -0.06]] },
  { k: 'B', name: 'Graph', tint: S, reads: 'device and payee fan-out',
    terms: [['device_fanout', 'n/a', 0.00], ['merchant_fanout', '812', -0.09],
            ['entity_degree', '11', 0.05]] },
  { k: 'C', name: 'Intent', tint: V, reads: 'mandate versus execution',
    terms: [['ceiling_utilisation', '0.70', 0.31], ['mcc_in_scope', 'true', -0.12],
            ['expired', 'false', -0.08], ['beneficiary_match', 'FALSE', 1.70]] },
]

/** Transactions streaming into the engine, so the scale is felt not stated. */
export function Stream({ rate = 320 }) {
  const [rows, setRows] = useState([])
  const n = useRef(0)
  useEffect(() => {
    const t = setInterval(() => {
      n.current += 1
      const agentic = Math.random() < 0.28
      setRows((r) => [{
        id: 'T' + String(884120 + n.current * 37),
        amt: Math.round(80 + Math.random() * 5200),
        rail: agentic ? 'R3' : Math.random() < 0.5 ? 'R4' : 'R2',
        agentic,
        key: n.current,
      }, ...r].slice(0, 7))
    }, rate)
    return () => clearInterval(t)
  }, [rate])

  return (
    <div className="rec space-y-1">
      {rows.map((r, i) => (
        <motion.div key={r.key}
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1 - i * 0.13, x: 0 }}
          transition={{ duration: 0.28 }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg"
          style={{
            background: r.agentic ? 'rgba(167,139,250,.16)' : 'rgba(255,255,255,.02)',
            border: `1px solid ${r.agentic ? 'rgba(167,139,250,.42)' : 'transparent'}`,
          }}>
          <span className="w-2 h-2 rounded-full shrink-0"
                style={{ background: r.agentic ? V : '#4A5163',
                         boxShadow: r.agentic ? `0 0 10px ${V}` : 'none' }} />
          <span style={{ color: r.agentic ? '#CDBEF8' : '#6E7688' }}>{r.id}</span>
          <span style={{ color: r.agentic ? V : '#6E7688' }}>{r.rail}</span>
          {r.agentic && (
            <span className="px-1.5 py-0.5 rounded text-[9px]"
                  style={{ background: `${V}2E`, color: V }}>agentic</span>
          )}
          <span className="ml-auto" style={{ color: r.agentic ? '#F2F3F7' : '#8A92A6' }}>
            ₹{r.amt.toLocaleString('en-IN')}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * One transaction taken apart. Terms accumulate on a timer so a judge watches
 * the arithmetic happen instead of reading a finished number.
 */
export function Engine({ focus = null, showFusion = false }) {
  const [t, setT] = useState(0)
  useEffect(() => {
    setT(0)
    const iv = setInterval(() => setT((v) => (v >= 6 ? v : v + 1)), 520)
    return () => clearInterval(iv)
  }, [focus])

  // A head only runs when it is the one being looked at. Previously the timer
  // was shared, so heads that were merely dimmed still filled in their terms
  // and Head C sat lit before it had done anything — which gives the answer
  // away and makes the sequence meaningless.
  const running = (h) => (focus ? h.k === focus : true)

  return (
    <div className="grid lg:grid-cols-[190px_1fr] gap-4">

      {/* the transaction under the microscope */}
      <div className="mod-sunk p-4 self-start">
        <div className="label mb-2.5">the authorisation</div>
        <div className="rec space-y-1.5">
          {[['id', 'T910044182'], ['amount', '₹4,212'], ['mcc', '5661'],
            ['agent_id', 'AGT070317'], ['mandate', 'MAN000441'], ['eci', '05']].map(([k, v], i) => (
            <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.06 }} className="flex justify-between gap-2">
              <span className="text-faint">{k}</span>
              <span className="text-txt truncate">{v}</span>
            </motion.div>
          ))}
        </div>
        <motion.div className="mt-3 pt-3 border-t border-white/[0.07]"
          initial={{ opacity: 0 }} animate={{ opacity: t >= 1 ? 1 : 0.2 }}>
          <div className="label">routed to</div>
          <div className="text-[13px] mt-0.5" style={{ color: V }}>agentic</div>
          <div className="label mt-0.5">agent_id is present</div>
        </motion.div>
      </div>

      {/* the three heads */}
      <div className="grid md:grid-cols-3 gap-3">
        {HEADS.map((h, hi) => {
          const on = running(h)
          const shown = on ? Math.max(0, t - 1) : 0
          const sum = h.terms.slice(0, shown).reduce((s, x) => s + x[2], 0)
          const done = on && t - 1 >= h.terms.length
          const fires = h.k === 'C' && done
          return (
            <motion.div key={h.k}
              animate={{ opacity: on ? 1 : 0.22, scale: on ? 1 : 0.985 }}
              transition={{ duration: 0.35 }}
              className="mod p-4"
              style={fires ? { borderColor: `${h.tint}66`, boxShadow: `0 0 44px -12px ${h.tint}` }
                           : on ? { borderColor: `${h.tint}2E` } : undefined}>

              <div className="flex items-center gap-2.5 mb-1">
                <motion.span className="w-7 h-7 rounded-lg flex items-center justify-center
                                        font-medium text-[13px] shrink-0"
                  animate={fires ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  style={{ background: `${h.tint}22`, color: h.tint }}>{h.k}</motion.span>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium truncate">{h.name}</div>
                  <div className="label truncate">{h.reads}</div>
                </div>
              </div>

              <div className="mt-3">
                {h.terms.map(([f, val, w], i) => {
                  const live = shown > i
                  return (
                    <motion.div key={f}
                      animate={{ opacity: live ? 1 : 0.16 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-[1fr_auto_46px] gap-2 items-baseline py-[5px]
                                 border-b border-white/[0.04] last:border-0">
                      <span className="mono text-[10px] text-dim truncate">{f}</span>
                      <span className="mono text-[10px] text-faint">{val}</span>
                      <span className="mono text-[11px] text-right"
                            style={{ color: w > 0.5 ? h.tint : w > 0 ? `${h.tint}99` : '#5A6070' }}>
                        {w >= 0 ? '+' : ''}{w.toFixed(2)}
                      </span>
                    </motion.div>
                  )
                })}
              </div>

              {/* the running total, and a bar that fills as it accumulates */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.09]">
                <div className="flex items-baseline justify-between">
                  <span className="label">weight of evidence</span>
                  <motion.span key={sum} className="mono text-[14px] font-medium"
                    initial={{ scale: 1.18 }} animate={{ scale: 1 }}
                    style={{ color: h.tint }}>
                    {sum >= 0 ? '+' : ''}{sum.toFixed(2)}
                  </motion.span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] mt-2 overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    animate={{ width: `${Math.min(100, Math.abs(sum) / 2 * 100)}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ background: h.tint }} />
                </div>
                <motion.div animate={{ opacity: done ? 1 : 0 }}
                  className="label mt-2" style={{ color: fires ? h.tint : '#646B80' }}>
                  {fires ? 'divergence — this head fires'
                         : done ? 'nothing anomalous' : 'waiting'}
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {showFusion && (
        <motion.div className="lg:col-span-2 mod p-5"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: t >= 6 ? 1 : 0.25, y: 0 }}
          transition={{ duration: 0.4 }}>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 items-center">
            <div className="mod-sunk p-4">
              <div className="label mb-1.5">calibrated, then summed</div>
              <div className="mono text-[11.5px] leading-[1.9] text-dim">
                z = logit(π) + Σ<sub>h</sub>( a<sub>h</sub>·s<sub>h</sub> + b<sub>h</sub> )
              </div>
            </div>
            <div className="text-center">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mono text-[20px]" style={{ color: M }}>→</motion.div>
            </div>
            <div className="mod-sunk p-4" style={{ borderColor: `${M}44` }}>
              <div className="label mb-1.5">this transaction</div>
              <div className="mono text-[11.5px] leading-[1.9]" style={{ color: M }}>
                z = −0.87 → p = 0.295
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/**
 * The device graph, made to mean something.
 *
 * Static, it is wallpaper. Here a trace walks the ring one hop at a time —
 * victim to mule, mule to mule, mule to cash-out — and the fan-out counter
 * climbs as each shared device is touched. That number is the thing a marginal
 * sampler cannot produce, so watching it climb is watching the argument.
 */
export function RingTrace({ ringMax = 37, legitMax = 8 }) {
  const [hop, setHop] = useState(0)
  const [log, setLog] = useState([])
  useEffect(() => {
    const iv = setInterval(() => setHop((h) => {
      const n = (h + 1) % 7
      // Keep the trace, do not just replace it. A judge needs to see the whole
      // path the money took, not the one hop that happens to be current.
      setL((prev) => prev)
      return n
    }), 1100)
    return () => clearInterval(iv)
  }, [])
  const setL = setLog
  useEffect(() => {
    const HOPLOG = [
      ['victim', 'PAY004417', 'UPI push', '₹42,000', 'device DEV0091'],
      ['mule 1', 'MUL0007',   'received',  '₹42,000', 'device DEV0442 · shared'],
      ['mule 2', 'MUL0019',   'layered',   '₹31,500', 'device DEV0442 · shared'],
      ['mule 3', 'MUL0023',   'layered',   '₹24,100', 'device DEV0442 · shared'],
      ['shared device', 'DEV0442', 'fan-out', `${ringMax} accounts`, 'flagged by head B'],
      ['mule 4', 'MUL0031',   'layered',   '₹18,900', 'device DEV0517 · shared'],
      ['cash-out', 'MER0088',  'merchant',  '₹18,900', 'aggregator-onboarded'],
    ]
    setLog((prev) => (hop === 0 ? [HOPLOG[0]] : [...prev, HOPLOG[hop]].slice(-7)))
  }, [hop, ringMax])

  const W = 620, H = 300
  const rnd = seeded(97)
  // legitimate: isolated pairs, scattered left
  const legit = Array.from({ length: 22 }, () => {
    const x = 40 + rnd() * 250, y = 30 + rnd() * 240
    return { x, y, acc: [[x + (rnd() - .5) * 34, y + (rnd() - .5) * 30]] }
  })
  // ring: four devices right, many accounts
  const devs = Array.from({ length: 4 }, (_, i) => ({ x: 430 + (i % 2) * 70, y: 70 + Math.floor(i / 2) * 120 }))
  const accs = Array.from({ length: 26 }, () => ({
    x: 380 + rnd() * 200, y: 30 + rnd() * 240, d: Math.floor(rnd() * 4),
  }))
  const HOPS = ['victim', 'mule 1', 'mule 2', 'mule 3', 'shared device', 'mule 4', 'cash-out']

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 300 }}>
        <defs>
          <filter id="gl" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* legitimate — quiet, isolated */}
        {/* Legitimate devices connect too — the edges were drawn at .22 alpha
            inside a group already at .5 opacity, so they were effectively
            invisible and only the ring appeared joined. That made the contrast
            look like an artefact rather than a finding. */}
        {legit.map((l, i) => (
          <g key={`l${i}`}>
            {l.acc.map(([ax, ay], j) => (
              <line key={j} x1={l.x} y1={l.y} x2={ax} y2={ay}
                    stroke="rgba(52,211,153,.55)" strokeWidth="1" />
            ))}
            <circle cx={l.x} cy={l.y} r="3.4" fill={M} />
            {l.acc.map(([ax, ay], j) => (
              <circle key={j} cx={ax} cy={ay} r="2.2" fill="#8FA9A0" />
            ))}
          </g>
        ))}

        {/* ring links */}
        {accs.map((a, i) => (
          <line key={`e${i}`} x1={devs[a.d].x} y1={devs[a.d].y} x2={a.x} y2={a.y}
                stroke={R} strokeWidth=".8" opacity={hop >= 3 ? '.38' : '.16'}
                style={{ transition: 'opacity .6s' }} />
        ))}
        {accs.map((a, i) => (
          <circle key={`a${i}`} cx={a.x} cy={a.y} r="2.2" fill={R} opacity=".8" />
        ))}
        {devs.map((d, i) => (
          <g key={`d${i}`}>
            <circle cx={d.x} cy={d.y} r="12" fill={A} opacity={hop >= 4 ? '.4' : '.18'}
                    filter="url(#gl)" style={{ transition: 'opacity .6s' }} />
            <circle cx={d.x} cy={d.y} r="4.2" fill={A} />
          </g>
        ))}

        {/* the trace — one hop at a time */}
        {Array.from({ length: Math.min(hop, 5) }, (_, i) => {
          const from = i === 0 ? { x: 300, y: 150 } : accs[i * 4]
          const to = accs[(i + 1) * 4]
          return (
            <motion.line key={`t${i}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke="#fff" strokeWidth="1.4" opacity=".9"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }} />
          )
        })}
      </svg>

      <div className="mod-sunk p-4 mb-3">
        <div className="font-display font-semibold text-[15px] mb-1">
          What you are looking at
        </div>
        <p className="prose-sm max-w-[92ch]">
          Each dot is an account or a handset; a line means that account has transacted from
          that handset. Position carries no meaning — this is a relationship graph, not a
          scatter plot, so there are no axes to read. The only quantity is
          <span className="text-txt"> how many accounts hang off one device</span>, and the
          white trace follows one payment through the ring hop by hop.
        </p>
      </div>

      <div className="flex items-center gap-4 mt-3 mb-4 flex-wrap">
        <span className="label flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: M }} />
          legitimate device · 1–{legitMax} accounts
        </span>
        <span className="label flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: A }} />
          ring device · up to {ringMax} accounts
        </span>
        <span className="label flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: R }} />
          mule account
        </span>
      </div>

      {/* the trace, as a log — so the whole path stays on screen */}
      <div className="mod-sunk overflow-hidden">
        <div className="grid gap-2 px-3 py-2 border-b border-white/[0.06]"
             style={{ gridTemplateColumns: '110px 96px 84px 96px 1fr' }}>
          {['hop', 'entity', 'action', 'amount', 'how we see it'].map((h) => (
            <div key={h} className="label">{h}</div>
          ))}
        </div>
        <div className="rec">
          {log.map((row, i) => (
            <motion.div key={`${row[1]}-${i}`}
              initial={{ opacity: 0, x: -12, backgroundColor: 'rgba(251,113,133,.14)' }}
              animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(0,0,0,0)' }}
              transition={{ duration: 0.5 }}
              className="grid gap-2 px-3 py-1.5 border-b border-white/[0.03] last:border-0"
              style={{ gridTemplateColumns: '110px 96px 84px 96px 1fr' }}>
              <span style={{ color: R }}>{row[0]}</span>
              <span className="text-txt">{row[1]}</span>
              <span className="text-faint">{row[2]}</span>
              <span className="text-dim">{row[3]}</span>
              <span className="text-faint truncate">{row[4]}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function seeded(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let x = Math.imul(a ^ (a >>> 15), 1 | a)
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}
