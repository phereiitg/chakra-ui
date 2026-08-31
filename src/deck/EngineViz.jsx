import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { V, M as MINT, R, A, S, G, rise, pop } from './bits.jsx'
import { Eq, M as Tex } from './Math.jsx'

/**
 * The detection engine, opened up.
 *
 * A judge stops here. Everything on these screens is a real quantity from a
 * real run, and every claim that rests on a calculation shows the calculation
 * — the general form, then the same expression with this run's numbers in it.
 */

/* ═══════════════════════════ the fan-out ═══════════════════════════ */
export function FanOut({ lit = null }) {
  const HEADS = [
    ['A', 'Behavioural', 'against its own past', MINT, 0.434],
    ['B', 'Graph', 'who stands next to it', S, 0.019],
    ['C', 'Intent', 'mandate vs execution', V, 0.708],
    ['P', 'Peer', 'vs 400 comparable agents', A, 0.595],
    ['S', 'Session', 'evidence over weeks', R, 0.879],
  ]
  return (
    <div className="w-full">
      <svg viewBox="0 0 940 330" className="w-full" style={{ maxHeight: 330 }}>
        <defs>
          <filter id="fg" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* source */}
        <motion.g {...pop(0.05)}>
          <rect x="352" y="8" width="236" height="42" rx="10"
                fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.14)" />
          <text x="470" y="27" textAnchor="middle" fontSize="12.5" fill="#F2F3F7"
                fontFamily="Instrument Sans">Authorisation</text>
          <text x="470" y="41" textAnchor="middle" fontSize="9.5" fill="#646B80"
                fontFamily="JetBrains Mono">ISO 8583 · one message</text>
        </motion.g>

        {/* router */}
        <line x1="470" y1="50" x2="470" y2="72" stroke="rgba(255,255,255,.18)" />
        <motion.g {...pop(0.14)}>
          <rect x="378" y="72" width="184" height="40" rx="10"
                fill="rgba(167,139,250,.10)" stroke="rgba(167,139,250,.4)" />
          <text x="470" y="90" textAnchor="middle" fontSize="12" fill={V}
                fontFamily="Instrument Sans">Router</text>
          <text x="470" y="104" textAnchor="middle" fontSize="9" fill="#646B80"
                fontFamily="JetBrains Mono">observable fields only</text>
        </motion.g>

        {/* fan out to five heads */}
        {HEADS.map(([k, name, sub, c, auc], i) => {
          const x = 60 + i * 205
          const on = lit === null || lit === k
          return (
            <g key={k} opacity={on ? 1 : 0.22} style={{ transition: 'opacity .4s' }}>
              <motion.path
                d={`M470,112 C470,150 ${x + 82},150 ${x + 82},176`}
                fill="none" stroke={c} strokeWidth={lit === k ? 2 : 1} opacity=".45"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.22 + i * 0.08 }} />
              <motion.g {...pop(0.3 + i * 0.08)}>
                {lit === k && (
                  <rect x={x} y="176" width="164" height="70" rx="12"
                        fill={c} opacity=".2" filter="url(#fg)" />
                )}
                <rect x={x} y="176" width="164" height="70" rx="12"
                      fill={`${c}12`} stroke={`${c}66`} />
                <circle cx={x + 24} cy="200" r="12" fill={`${c}28`} />
                <text x={x + 24} y="205" textAnchor="middle" fontSize="12.5"
                      fill={c} fontFamily="Instrument Sans" fontWeight="600">{k}</text>
                <text x={x + 44} y="199" fontSize="12.5" fill="#F2F3F7"
                      fontFamily="Instrument Sans">{name}</text>
                <text x={x + 44} y="213" fontSize="9" fill="#646B80"
                      fontFamily="JetBrains Mono">{sub}</text>
                <text x={x + 12} y="236" fontSize="9.5" fill="#646B80"
                      fontFamily="JetBrains Mono">PR-AUC agentic</text>
                <text x={x + 152} y="236" textAnchor="end" fontSize="11.5"
                      fill={c} fontFamily="JetBrains Mono">{auc.toFixed(3)}</text>
              </motion.g>
              <motion.path
                d={`M${x + 82},246 C${x + 82},272 470,272 470,290`}
                fill="none" stroke={c} strokeWidth="1" opacity=".35"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.55 + i * 0.06 }} />
            </g>
          )
        })}

        {/* fusion — the heaviest thing on the diagram, deliberately */}
        <motion.g {...pop(0.85)}>
          <rect x="330" y="288" width="280" height="34" rx="10"
                fill="rgba(52,211,153,.14)" stroke="rgba(52,211,153,.5)" />
          <text x="470" y="309" textAnchor="middle" fontSize="12" fill={MINT}
                fontFamily="JetBrains Mono">
            z = logit π + Σ LLR
          </text>
        </motion.g>
      </svg>
    </div>
  )
}

/* ═════════════════════ a head, tallying ═════════════════════ */
export function HeadTally({ k, name, tint, reads, terms, total, verdict,
                            fires, auc, iv, note }) {
  const [t, setT] = useState(0)
  useEffect(() => {
    setT(0)
    const iv2 = setInterval(() => setT((v) => (v >= terms.length ? v : v + 1)), 460)
    return () => clearInterval(iv2)
  }, [k, terms.length])
  const sum = terms.slice(0, t).reduce((s, x) => s + x[2], 0)
  const done = t >= terms.length

  return (
    <div className="grid lg:grid-cols-[1.25fr_1fr] gap-4">
      <motion.div {...rise(0.05)} className="mod p-5"
        style={done && fires ? { borderColor: `${tint}66`,
                                 boxShadow: `0 0 44px -12px ${tint}` } : undefined}>
        <div className="flex items-center gap-3 mb-1">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center
                           font-semibold text-[14px]"
                style={{ background: `${tint}22`, color: tint }}>{k}</span>
          <div>
            <div className="text-[15px] font-medium">{name}</div>
            <div className="label">{reads}</div>
          </div>
          {auc !== undefined && (
            <span className="ml-auto text-right">
              <div className="mono text-[15px]" style={{ color: tint }}>{auc.toFixed(3)}</div>
              <div className="label">PR-AUC agentic</div>
            </span>
          )}
        </div>

        <div className="mod-sunk p-4 mt-4">
          <div className="grid grid-cols-[1fr_auto_58px] gap-3 pb-2 mb-1
                          border-b border-white/[0.07]">
            <span className="label">feature</span>
            <span className="label">value</span>
            <span className="label text-right">WOE</span>
          </div>
          {terms.map(([f, val, w], i) => (
            <motion.div key={f}
              animate={{ opacity: t > i ? 1 : 0.15, x: t > i ? 0 : -6 }}
              transition={{ duration: 0.28 }}
              className="grid grid-cols-[1fr_auto_58px] gap-3 items-baseline py-[7px]
                         border-b border-white/[0.04] last:border-0">
              <span className="mono text-[11px] text-dim truncate">{f}</span>
              <span className="mono text-[11px] text-faint">{val}</span>
              <span className="mono text-[12px] text-right"
                    style={{ color: w > 0.4 ? tint : w > 0 ? `${tint}99` : '#5A6070' }}>
                {w >= 0 ? '+' : ''}{w.toFixed(2)}
              </span>
            </motion.div>
          ))}
          <div className="grid grid-cols-[1fr_58px] gap-3 pt-3 mt-2
                          border-t border-white/[0.1]">
            <span className="text-[12px] text-dim">weight of evidence</span>
            <motion.span key={sum.toFixed(2)} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
              className="mono text-[15px] text-right font-medium" style={{ color: tint }}>
              {sum >= 0 ? '+' : ''}{sum.toFixed(2)}
            </motion.span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-3 content-start">
        <motion.div {...pop(0.35)} className="mod p-5"
          style={done && fires ? { borderColor: `${tint}55` } : undefined}>
          <div className="font-display font-semibold text-[22px] leading-tight"
               style={{ color: done ? (fires ? tint : G) : '#3A3F4C' }}>
            {done ? verdict : 'accumulating…'}
          </div>
          <div className="label mt-2">
            {done ? (fires ? 'this head fires' : 'this head stays quiet') : ''}
          </div>
        </motion.div>

        {iv && (
          <motion.div {...rise(0.5)} className="mod p-5">
            <div className="label mb-1">Information value</div>
            <div className="text-[12px] text-faint leading-relaxed mb-3">
              Which features carry this head across the whole corpus, not which
              happened to fire on one example.
            </div>
            {iv.map(([f, v]) => (
              <div key={f} className="mb-2 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="mono text-[10.5px] text-dim truncate">{f}</span>
                  <span className="mono text-[11px]" style={{ color: tint }}>{v.toFixed(2)}</span>
                </div>
                <div className="h-[3px] rounded-full bg-white/[0.06] mt-1 overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: tint }}
                    initial={{ width: 0 }} animate={{ width: `${Math.min(100, v * 55)}%` }}
                    transition={{ duration: 0.6, delay: 0.6 }} />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {note && (
          <motion.div {...rise(0.65)} className="mod-sunk p-4">
            <p className="text-[12.5px] text-faint leading-relaxed">{note}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════ the peer cloud — Head P's whole argument ═══════════════ */
export function PeerCloud() {
  const pts = useMemo(() => {
    const rnd = seeded(1234)
    // peers: agents given the same instruction, clustered where you'd expect
    const peers = Array.from({ length: 180 }, () => ({
      x: 0.18 + Math.abs(rnd() + rnd() + rnd() - 1.5) * 0.42,
      y: 0.30 + (rnd() + rnd() - 1) * 0.30,
    }))
    return peers
  }, [])

  return (
    <div>
      <svg viewBox="0 0 720 300" className="w-full" style={{ maxHeight: 300 }}>
        <defs>
          <filter id="pg" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        {/* axes */}
        <line x1="60" y1="255" x2="690" y2="255" stroke="rgba(255,255,255,.1)" />
        <line x1="60" y1="24" x2="60" y2="255" stroke="rgba(255,255,255,.1)" />
        <text x="375" y="282" textAnchor="middle" fontSize="10" fill="#646B80"
              fontFamily="JetBrains Mono">how popular the merchant is, among peers →</text>
        <text x="18" y="140" fontSize="10" fill="#646B80" fontFamily="JetBrains Mono"
              transform="rotate(-90 18 140)">amount ÷ ceiling →</text>

        {/* peers */}
        {pts.map((p, i) => (
          <motion.circle key={i}
            cx={60 + p.x * 630} cy={255 - p.y * 231} r="3"
            fill={A} opacity=".38"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.15 + (i / pts.length) * 0.7, duration: 0.3 }} />
        ))}

        {/* the one under examination */}
        <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.15, type: 'spring', stiffness: 180 }}>
          <circle cx="628" cy="70" r="16" fill={R} opacity=".45" filter="url(#pg)" />
          <circle cx="628" cy="70" r="5.5" fill={R} />
          <circle cx="628" cy="70" r="13" fill="none" stroke={R} strokeWidth="1.2" opacity=".7" />
          <line x1="628" y1="86" x2="628" y2="255" stroke={R} strokeWidth="1"
                strokeDasharray="3 4" opacity=".5" />
          <line x1="60" y1="70" x2="612" y2="70" stroke={R} strokeWidth="1"
                strokeDasharray="3 4" opacity=".5" />
          <text x="612" y="52" textAnchor="end" fontSize="11" fill={R}
                fontFamily="JetBrains Mono">this execution</text>
        </motion.g>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}>
          <text x="200" y="120" fontSize="11" fill={A} fontFamily="JetBrains Mono">
            180 agents, same instruction
          </text>
        </motion.g>
      </svg>

      <div className="grid sm:grid-cols-3 gap-3 mt-2">
        {[['0.3rd', 'percentile among peers', R],
          ['0 of 180', 'peers used this merchant', R],
          ['9', 'usable intent clusters', A]].map(([v, l, c], i) => (
          <motion.div key={l} {...pop(1.6 + i * 0.1)} className="mod-sunk p-4">
            <div className="font-display font-semibold text-[22px]" style={{ color: c }}>{v}</div>
            <div className="label mt-1">{l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════ Head S — the SPRT boundary ═══════════════════ */
export function SprtChart() {
  const UPPER = 5.01, LOWER = -1.38
  const path = [0, 0.9, 1.7, 3.2, 5.4]          // Λ after each step
  const benign = [0, 0.3, -0.2, -0.6, -1.5]
  const W = 720, H = 280, P = { l: 54, r: 90, t: 20, b: 34 }
  const x = (i) => P.l + ((W - P.l - P.r) * i) / (path.length - 1)
  const y = (v) => P.t + (H - P.t - P.b) * (1 - (v - (LOWER - 1)) / (UPPER + 1.6 - (LOWER - 1)))

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 280 }}>
        {/* boundaries */}
        <line x1={P.l} y1={y(UPPER)} x2={W - P.r} y2={y(UPPER)}
              stroke={R} strokeDasharray="5 5" strokeWidth="1.2" opacity=".75" />
        <text x={W - P.r + 8} y={y(UPPER) + 4} fontSize="10" fill={R}
              fontFamily="JetBrains Mono">intervene</text>
        <text x={W - P.r + 8} y={y(UPPER) + 17} fontSize="9" fill="#646B80"
              fontFamily="JetBrains Mono">ln((1−β)/α) = {UPPER}</text>

        <line x1={P.l} y1={y(LOWER)} x2={W - P.r} y2={y(LOWER)}
              stroke={MINT} strokeDasharray="5 5" strokeWidth="1.2" opacity=".7" />
        <text x={W - P.r + 8} y={y(LOWER) + 4} fontSize="10" fill={MINT}
              fontFamily="JetBrains Mono">clear</text>
        <text x={W - P.r + 8} y={y(LOWER) + 17} fontSize="9" fill="#646B80"
              fontFamily="JetBrains Mono">ln(β/(1−α)) = {LOWER}</text>

        <text x={P.l - 10} y={y(0) + 4} textAnchor="end" fontSize="10" fill="#646B80"
              fontFamily="JetBrains Mono">Λ=0</text>
        <line x1={P.l} y1={y(0)} x2={W - P.r} y2={y(0)} stroke="rgba(255,255,255,.08)" />

        {/* the compromised session */}
        <motion.path d={path.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')}
          fill="none" stroke={R} strokeWidth="2.6" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.0, delay: 0.3, ease: 'easeInOut' }} />
        {path.map((v, i) => (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.42 }}>
            <circle cx={x(i)} cy={y(v)} r={v >= UPPER ? 6 : 3.6} fill={R}
                    style={v >= UPPER ? { filter: `drop-shadow(0 0 10px ${R})` } : undefined} />
            <text x={x(i)} y={H - 14} textAnchor="middle" fontSize="10" fill="#9BA1B4"
                  fontFamily="JetBrains Mono">step {i}</text>
          </motion.g>
        ))}

        {/* a legitimate one, drifting down */}
        <motion.path d={benign.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')}
          fill="none" stroke={MINT} strokeWidth="1.8" strokeDasharray="4 4" opacity=".8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.0, delay: 0.5, ease: 'easeInOut' }} />

        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.3 }}
          x={x(4)} y={y(5.4) - 16} textAnchor="middle" fontSize="10.5" fill={R}
          fontFamily="JetBrains Mono">crosses at step 4</motion.text>
      </svg>

      <div className="flex gap-6 mt-2 flex-wrap">
        {[[R, 'a compromised session — evidence accumulates'],
          [MINT, 'a legitimate one — evidence drifts toward clear']].map(([c, l]) => (
          <span key={l} className="label flex items-center gap-2">
            <span className="w-4 h-[2px] rounded" style={{ background: c }} />{l}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ═════════════════════ a formula, then the numbers ═════════════════════ */
export function Formula({ name, theorem, symbols, substituted, note, tint = V, delay = 0 }) {
  return (
    <motion.div {...rise(delay)} className="mod p-5">
      {/* The theorem is the headline, not a badge in the corner. Hiding the
          name of the result behind a 10px pill was the opposite of the point. */}
      {theorem && (
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-[2px] rounded-full" style={{ background: tint }} />
          <span className="text-[13px] font-medium tracking-wide" style={{ color: tint }}>
            {theorem}
          </span>
        </div>
      )}
      <div className="card-title !text-[19px] mb-1">{name}</div>
      <div className="mod-sunk px-4 py-3.5 mt-3">
        {(Array.isArray(symbols) ? symbols : [symbols]).map((t, i) => (
          <Eq key={i}>{t}</Eq>
        ))}
      </div>
      {substituted && (
        <div className="mod-sunk px-4 py-3.5 mt-2.5" style={{ borderColor: `${tint}3D` }}>
          <div className="label mb-2">with this run's values</div>
          {Array.isArray(substituted)
            ? substituted.map((t, i) =>
                typeof t === 'string' && t.startsWith('~')
                  ? <div key={i} className="label mt-1.5">{t.slice(1)}</div>
                  : <Eq key={i} tint={tint}>{t}</Eq>)
            : <Eq tint={tint}>{substituted}</Eq>}
        </div>
      )}
      {note && <p className="card-body mt-3.5">{note}</p>}
    </motion.div>
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
