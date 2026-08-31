import React from 'react'
import { motion } from 'framer-motion'

export const V = '#A78BFA', M = '#34D399', R = '#FB7185', A = '#FBBF24', S = '#38BDF8', G = '#9BA1B4'

export const rise = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.2, 0.7, 0.3, 1] },
})
export const pop = (d = 0) => ({
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, delay: d, ease: [0.2, 0.8, 0.3, 1] },
})

export function Card({ children, tint, glow, className = '', delay = 0 }) {
  return (
    <motion.div {...rise(delay)} className={`mod p-5 ${className}`}
      style={glow ? { borderColor: `${tint}55`, boxShadow: `0 0 48px -14px ${tint}99` } : undefined}>
      {children}
    </motion.div>
  )
}

export function Big({ value, label, sub, tint = '#F2F3F7', delay = 0 }) {
  return (
    <motion.div {...pop(delay)} className="mod-sunk p-5">
      <div className="font-display font-semibold text-[32px] leading-none tracking-tight"
           style={{ color: tint, textShadow: `0 0 30px ${tint}44` }}>{value}</div>
      <div className="text-[13px] mt-2.5">{label}</div>
      {sub && <div className="label mt-1">{sub}</div>}
    </motion.div>
  )
}

/**
 * A source, in a macOS window.
 *
 * A card with a title is a claim; a window with the real URL in its address bar
 * and a screenshot inside it is the document. Where a screenshot has not been
 * added yet the frame falls back to a sketch, so the card and the link work
 * either way and nothing looks broken while the set fills up.
 */
export function DocCard({ src, delay = 0, compact = false }) {
  const { tint, title, host, path, href, meta, badge, shot } = src

  // Try each extension in turn before giving up on the screenshot. Saves
  // renaming files by hand when one export happens to be a png and the rest
  // are jpgs, and a missing image degrades to the sketch rather than a broken
  // image icon.
  const candidates = React.useMemo(() => {
    if (!shot) return []
    const base = shot.replace(/\.(jpe?g|png|webp)$/i, '')
    return [`${base}.jpg`, `${base}.jpeg`, `${base}.png`, `${base}.webp`]
  }, [shot])
  const [tryAt, setTryAt] = React.useState(0)
  const ok = tryAt < candidates.length
  return (
    <motion.a {...rise(delay)} href={href} target="_blank" rel="noreferrer"
      whileHover={{ y: -4 }}
      className="block group cursor-pointer"
      style={{ textDecoration: 'none' }}>
      <div className="rounded-xl overflow-hidden border transition-shadow"
           style={{ borderColor: 'rgba(255,255,255,.09)',
                    boxShadow: '0 18px 46px -18px rgba(0,0,0,.95)' }}>

        {/* macOS title bar */}
        <div className="flex items-center gap-2.5 px-3 py-2"
             style={{ background: 'linear-gradient(#26262E,#1C1C22)' }}>
          <div className="flex gap-[6px] shrink-0">
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <span key={c} className="w-[10px] h-[10px] rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 min-w-0 flex items-center gap-1.5 px-2.5 py-[3px]
                          rounded-md bg-black/45 border border-white/[0.06]">
            <span className="mono text-[9.5px] shrink-0" style={{ color: tint }}>⚿</span>
            <span className="mono text-[9.5px] truncate">
              <span className="text-txt">{host}</span>
              <span className="text-faint">{path}</span>
            </span>
          </div>
        </div>

        {/* the page */}
        <div className="bg-[#0E0F15]">
          {ok ? (
            <img src={candidates[tryAt]} alt={title}
                 onError={() => setTryAt((i) => i + 1)}
                 className="w-full block"
                 style={{ aspectRatio: '16/10', objectFit: 'cover', objectPosition: 'top' }} />
          ) : (
            <div className="p-4" style={{ aspectRatio: compact ? '16/9' : '16/10' }}>
              <div className="w-9 h-1 rounded-full mb-3" style={{ background: tint }} />
              <div className="text-[13px] font-medium leading-snug">{title}</div>
              <div className="mt-3 space-y-1.5">
                {[100, 86, 93, 64, 78].map((w, i) => (
                  <motion.div key={i} className="h-[3px] rounded-full bg-white/[0.07]"
                    initial={{ width: 0 }} animate={{ width: `${w}%` }}
                    transition={{ delay: delay + 0.2 + i * 0.06, duration: 0.4 }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* caption */}
      <div className="mt-3">
        <div className="text-[13.5px] font-medium leading-snug group-hover:underline"
             style={{ textDecorationColor: tint }}>{title}</div>
        <div className="mono text-[10px] mt-1.5" style={{ color: `${tint}CC` }}>{meta}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full"
                style={{ background: `${tint}18` }}>
            <span className="w-1 h-1 rounded-full" style={{ background: tint }} />
            <span className="mono text-[9.5px]" style={{ color: tint }}>{badge}</span>
          </span>
          <span className="label ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: tint }}>open ↗</span>
        </div>
      </div>
    </motion.a>
  )
}

/**
 * A stack of papers in one window.
 *
 * Five arXiv pages would be five near-identical screenshots of the same
 * grey abstract page, which tells a judge nothing and is a chore to keep
 * current. A single window listing them, each row a live link, carries the
 * same authority with none of that.
 */
export function ListCard({ title, host, path, tint, items, note, delay = 0 }) {
  return (
    <motion.div {...rise(delay)}>
      <div className="rounded-xl overflow-hidden border"
           style={{ borderColor: 'rgba(255,255,255,.09)',
                    boxShadow: '0 18px 46px -18px rgba(0,0,0,.95)' }}>
        <div className="flex items-center gap-2.5 px-3 py-2"
             style={{ background: 'linear-gradient(#26262E,#1C1C22)' }}>
          <div className="flex gap-[6px] shrink-0">
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <span key={c} className="w-[10px] h-[10px] rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 min-w-0 flex items-center gap-1.5 px-2.5 py-[3px]
                          rounded-md bg-black/45 border border-white/[0.06]">
            <span className="mono text-[9.5px] shrink-0" style={{ color: tint }}>⚿</span>
            <span className="mono text-[9.5px] truncate">
              <span className="text-txt">{host}</span><span className="text-faint">{path}</span>
            </span>
          </div>
        </div>

        <div className="bg-[#0E0F15] p-1.5">
          {items.map((it, i) => (
            <motion.a key={it.id} href={it.href} target="_blank" rel="noreferrer"
              {...rise(delay + 0.1 + i * 0.07)}
              whileHover={{ x: 3 }}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg group
                         hover:bg-white/[0.04] transition-colors"
              style={{ textDecoration: 'none' }}>
              <span className="mono text-[10px] shrink-0 mt-[3px]"
                    style={{ color: tint }}>{it.id}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] leading-snug group-hover:underline"
                     style={{ textDecorationColor: tint }}>{it.title}</div>
                <div className="label mt-0.5 leading-snug">{it.gave}</div>
              </div>
              <span className="label shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: tint }}>↗</span>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[13.5px] font-medium leading-snug">{title}</div>
        <div className="mono text-[10px] mt-1.5" style={{ color: `${tint}CC` }}>
          {items.length} papers · all open access
        </div>
        {note && <p className="label mt-2 leading-relaxed">{note}</p>}
      </div>
    </motion.div>
  )
}

/** Nodes on a path, lighting in sequence. */
/**
 * A path of stages, with a packet visibly travelling it.
 *
 * The previous version faded boxes in and called that motion. Nothing moved
 * BETWEEN them, so a judge saw a row of cards rather than a payment going
 * somewhere. Now a pulse runs the connectors and each stage lights as it
 * arrives, which is the difference between a diagram and a flow.
 */
export function Path({ nodes, hostileAt = -1, tint = M, vertical = false }) {
  const [at, setAt] = React.useState(-1)
  React.useEffect(() => {
    setAt(-1)
    const t = nodes.map((_, i) => setTimeout(() => setAt(i), 300 + i * 620))
    const loop = setTimeout(() => setAt(nodes.length), 300 + nodes.length * 620)
    return () => { t.forEach(clearTimeout); clearTimeout(loop) }
  }, [nodes.length, hostileAt])

  return (
    <div className={vertical ? 'space-y-2' : 'flex items-stretch gap-0 overflow-x-auto pb-2'}>
      {nodes.map(([label, sub, extra], i) => {
        const hostile = i === hostileAt
        const c = hostile ? R : (hostileAt >= 0 && i > hostileAt) ? A : tint
        const live = at >= i
        return (
          <React.Fragment key={label}>
            {i > 0 && !vertical && (
              <div className="relative self-center w-8 shrink-0 h-[2px] rounded-full
                              bg-white/[0.08] mx-1 overflow-hidden">
                <motion.div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: c }}
                  animate={{ width: live ? '100%' : '0%' }}
                  transition={{ duration: 0.45 }} />
                {at === i && (
                  <motion.span className="absolute -top-[3px] w-2 h-2 rounded-full"
                    style={{ background: c, boxShadow: `0 0 12px ${c}` }}
                    initial={{ left: '-8px' }} animate={{ left: '100%' }}
                    transition={{ duration: 0.45 }} />
                )}
              </div>
            )}
            <motion.div
              animate={{ opacity: live ? 1 : 0.28, y: live ? 0 : 6 }}
              transition={{ duration: 0.35 }}
              className="mod-sunk px-4 py-4 min-w-[152px] flex-1"
              style={{
                borderColor: live ? `${c}55` : 'rgba(255,255,255,.05)',
                boxShadow: hostile && live ? `0 0 38px -10px ${c}` : undefined,
              }}>
              <div className="flex items-center gap-2 mb-2">
                <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: c }}
                  animate={live ? { opacity: [0.45, 1, 0.45] } : { opacity: 0.2 }}
                  transition={{ duration: 2.2, repeat: Infinity }} />
                <span className="card-meta" style={{ color: live ? c : '#5E6577' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="font-display font-semibold text-[15px] leading-tight"
                   style={hostile && live ? { color: c } : undefined}>{label}</div>
              <div className="prose-sm mt-1.5">{sub}</div>
              {extra && (
                <div className="card-meta mt-2.5 pt-2.5 border-t border-white/[0.06]"
                     style={{ color: `${c}CC` }}>{extra}</div>
              )}
            </motion.div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export function Checklist({ items, breakLast, tint = M }) {
  return (
    <div>
      {items.map(([k, v], i) => {
        const bad = breakLast && i === items.length - 1
        return (
          <motion.div key={k}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.2, duration: 0.32 }}
            className="flex items-baseline justify-between gap-4 py-2.5
                       border-b border-white/[0.06] last:border-0">
            <span className="text-[13.5px] text-dim">{k}</span>
            <span className="mono text-[12px]" style={{ color: bad ? R : tint }}>
              {bad ? '✕ ' : '✓ '}{v}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

/** A curve that draws itself. */
/**
 * A line chart that says what its axes are.
 *
 * The previous version drew a curve with bare tick numbers and no labels, so a
 * judge could see a line fall without knowing what fell or against what. Both
 * axes are now named on the chart itself.
 */
export function Curve({ series, total, colour = M, dashed, height = 230,
                        yLabel = 'escape rate  %', xLabel = 'loop iteration',
                        annotate }) {
  const W = 820, H = height, P = { l: 62, r: 16, t: 14, b: 48 }
  const x = (i) => P.l + ((W - P.l - P.r) * i) / Math.max(1, total - 1)
  const y = (v) => P.t + (H - P.t - P.b) * (1 - v / 100)
  const d = series.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={P.l} y1={y(g)} x2={W - P.r} y2={y(g)}
                stroke={g === 0 ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.055)'} />
          <text x={P.l - 9} y={y(g) + 3.5} textAnchor="end" className="axis-tick">{g}</text>
        </g>
      ))}
      {/* axis names, because a line without them is a decoration */}
      <text x={-(H - P.b + P.t) / 2} y="15" transform="rotate(-90)" textAnchor="middle"
            className="axis-label">{yLabel}</text>
      <text x={(P.l + W - P.r) / 2} y={H - 6} textAnchor="middle"
            className="axis-label">{xLabel}</text>
      {Array.from({ length: total }, (_, i) => (
        <text key={`t${i}`} x={x(i)} y={H - 28} textAnchor="middle"
              className="axis-tick">{i + 1}</text>
      ))}
      {annotate && annotate.map(([i, v, txt, col], k) => (
        <g key={k}>
          <line x1={x(i)} y1={y(v) - 8} x2={x(i)} y2={y(v) - 26}
                stroke={col} strokeWidth="1" opacity=".6" />
          <text x={x(i)} y={y(v) - 32} textAnchor="middle" fontSize="10.5"
                fill={col} fontFamily="Instrument Sans">{txt}</text>
        </g>
      ))}
      <motion.path d={d} fill="none" stroke={colour} strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? '5 5' : undefined}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }} />
      {series.map((v, i) => (
        <motion.circle key={i} cx={x(i)} cy={y(v)} r="3.2" fill={colour}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + (i / series.length) * 1.4 }} />
      ))}
    </svg>
  )
}
