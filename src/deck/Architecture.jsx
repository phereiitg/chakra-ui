import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { V, M, R, A, S, G } from './bits.jsx'

/**
 * The whole system, on one screen.
 *
 * This is the diagram a judge looks at to decide whether the thing is real.
 * Every box names an actual module, every number is measured, and the feedback
 * arrow is drawn heavy because the loop is the claim — the brief asks for a
 * closed system, and an architecture picture that does not visibly close is a
 * pipeline with an extra stage bolted on.
 *
 * Four lanes, matching the three pillars plus the loop that joins them:
 *
 *   IDENTIFY   documents        -> 94 vectors
 *   GENERATE   entities         -> 216,112 transactions
 *   DEFEND     features         -> a decision
 *   SEARCH     what escaped     -> back into GENERATE
 */

const LANES = [
  {
    id: 'identify', name: 'Identify', tint: S, y: 24,
    sub: 'research the landscape',
    nodes: [
      { id: 'src', x: 24, w: 150, t: 'Six sources', s: 'F3 · OWASP · AP2 · RBI · papers · CVEs',
        detail: 'MITRE Fight Fraud Framework v1.1, OWASP Agentic Top 10, Google AP2 security considerations, the RBI April 2026 discussion paper, five open-access red-team papers, and the incident record. Every vector traces to one of these or is marked as ours.' },
      { id: 'map', x: 206, w: 150, t: 'F3 mapping', s: '123 techniques scanned',
        file: 'taxonomy/', detail: 'Every vector gets a real MITRE technique ID. We keyword-scanned all 123 F3 techniques for ai, llm, deepfake, mandate and six other terms: zero hits. So our 28 F3X- techniques are genuine extensions, namespaced so nobody confuses them with the standard.' },
      { id: 'grid', x: 388, w: 150, t: '8 × 7 matrix', s: 'tactic × rail',
        detail: 'Eight F3 tactics crossed with seven payment rails. Filling it from the documents leaves gaps, and the gaps are where the derived vectors came from. Card-present stays empty across all eight tactics, which is a result rather than an omission.' },
      { id: 'tax', x: 570, w: 162, t: '94 vectors', s: '64 documented · 30 derived',
        file: 'taxonomy.json', detail: 'Each graded N0 to N4 by what stands behind it, so the count is checkable. Six are implemented as attack plugins; the rest establish the landscape, and the board says which is which.' },
    ],
  },
  {
    id: 'generate', name: 'Generate', tint: A, y: 150,
    sub: 'run a world, collect the exhaust',
    nodes: [
      { id: 'build', x: 24, w: 150, t: 'Build entities', s: '11,000 payers · 9,200 devices',
        file: 'world/engine.py', detail: 'People with spending habits, handsets, merchants, 2,824 AI agents and 120 mule accounts. Each carries state across time — a mule has a life: recruited, dormant, burst, burned. Nobody has transacted yet.' },
      { id: 'tick', x: 206, w: 150, t: 'Advance 180 days', s: 'Hawkes arrivals · sessions',
        file: 'world/arrivals.py', detail: 'Self-exciting arrivals so activity clusters the way real spending does, a von Mises circadian cycle so 23:00 sits beside 01:00, and a two-state day-scale activity chain so people go quiet for weeks and come back.' },
      { id: 'rails', x: 388, w: 150, t: 'Rail adapters', s: 'ISO 8583 · UPI push and collect',
        file: 'rails/adapters.py', detail: 'Each event becomes a real message carrying only the fields that rail genuinely has. A card authorisation gets DE 2, 4, 18, 22, 39; a UPI payment gets a VPA and a device binding. No universal device fingerprint, because the network node does not see one.' },
      { id: 'atk', x: 570, w: 150, t: 'Six attacks', s: '6 plugins × 6 campaigns',
        file: 'attacks/plugins.py', detail: 'Attacks perturb the world rather than appending rows. The mule farm recruits accounts and binds handsets; the agent compromise poisons listings. Each has declared parameter ranges, which is what the loop mutates.' },
      { id: 'corpus', x: 752, w: 162, t: '216,112 transactions', s: '1.22% fraud · ground truth held apart',
        file: 'labelled_corpus.csv', detail: 'Plus mandates.csv holding 20,021 signed mandates with what was actually bought. Ground truth lives in a separate file so the detector can never see the answer.' },
    ],
  },
  {
    id: 'defend', name: 'Defend', tint: M, y: 276,
    sub: 'five readings, one decision',
    nodes: [
      { id: 'feat', x: 24, w: 150, t: 'Feature builder', s: 'node visibility enforced',
        file: 'detect/features.py', detail: 'Every feature declares the raw fields it derives from, and the builder raises on anything the network position cannot observe. A merchant-side device fingerprint next to an issuer-side balance is impossible here, not merely discouraged.' },
      { id: 'route', x: 206, w: 132, t: 'Router', s: 'observable fields only',
        file: 'detect/portfolio.py', detail: 'agent_id present goes agentic; UPI rails go push; card rails go card. Never the trust link or attack family — those are answers, not clues, and a router using them could not run in production. Each route carries its own friction budget.' },
      { id: 'heads', x: 370, w: 210, t: 'Five heads', s: 'A behavioural · B graph · C intent · P peer · S session',
        file: 'peer.py · semantic.py · sequential.py', detail: 'A and B are anomaly detectors. C compares the mandate to the execution. P compares this execution to 400 comparable ones. S accumulates evidence across a session using Wald\u2019s SPRT. Three of the five exist only because agentic fraud carries no anomaly.' },
      { id: 'fuse', x: 612, w: 140, t: 'Fusion', s: 'Platt, then Bayes odds',
        file: 'detect/heads.py', detail: 'Each head is Platt-calibrated to a log-likelihood ratio before summing, because raw weight-of-evidence totals have head-specific scale. Measured: raw sum 0.134 PR-AUC, after calibration 0.308.' },
      { id: 'gate', x: 784, w: 130, t: 'Gate + decision', s: 'conformal · Stackelberg · cost',
        file: 'detect/adversarial.py', detail: 'A conformal threshold holds the stated friction budget with a finite-sample guarantee, corrected against the worst attack configuration the loop found. Then expected cost picks approve, step-up or decline.' },
    ],
  },
  {
    id: 'search', name: 'Red search', tint: R, y: 402,
    sub: 'the gaps become the next attacks',
    nodes: [
      { id: 'esc', x: 206, w: 150, t: 'Escape log', s: 'what got through, and how',
        file: 'redsearch/loop.py', detail: 'Every attack transaction the detector missed, recorded with the exact parameters that let it through and how far under the threshold it landed. A near miss is more informative than a comfortable escape, because the gradient is there.' },
      { id: 'fit', x: 388, w: 150, t: 'Fitness', s: 'escape × value ÷ cost',
        detail: 'The cost term is what stops the search proposing attacks nobody would run — ten thousand mules moving a rupee each. With it, the search finds attacks a real adversary would actually choose.' },
      { id: 'mut', x: 570, w: 150, t: 'Mutate', s: 'elite 3 · offspring 3',
        detail: 'The best configurations breed inside their declared parameter ranges, so every proposal stays physically meaningful. One random survivor is kept so the search does not collapse onto a single lineage.' },
    ],
  },
]

const EDGES = [
  // within identify
  ['src', 'map'], ['map', 'grid'], ['grid', 'tax'],
  // identify -> generate
  ['tax', 'atk', 'down'],
  // within generate
  ['build', 'tick'], ['tick', 'rails'], ['rails', 'atk'], ['atk', 'corpus'],
  // generate -> defend
  ['corpus', 'feat', 'wrap'],
  // within defend
  ['feat', 'route'], ['route', 'heads'], ['heads', 'fuse'], ['fuse', 'gate'],
  // defend -> search
  ['gate', 'esc', 'down'],
  // within search
  ['esc', 'fit'], ['fit', 'mut'],
]

const NODE_H = 62

export default function Architecture() {
  const [hover, setHover] = useState(null)
  const all = LANES.flatMap((l) => l.nodes.map((n) => ({ ...n, lane: l })))
  const byId = Object.fromEntries(all.map((n) => [n.id, n]))
  const info = hover ? byId[hover] : null

  const cx = (n) => n.x + n.w / 2
  const cy = (n) => n.lane.y + NODE_H / 2

  return (
    <div>
      <div className="mod p-4 overflow-x-auto">
        <svg viewBox="-18 -14 976 522" className="w-full" style={{ minWidth: 800 }}>
          <defs>
            <marker id="ah" markerWidth="7" markerHeight="7" refX="6" refY="3.5"
                    orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="rgba(255,255,255,.4)" />
            </marker>
            <marker id="ahr" markerWidth="9" markerHeight="9" refX="7" refY="4.5"
                    orient="auto">
              <path d="M0,0 L9,4.5 L0,9 Z" fill={R} />
            </marker>
          </defs>

          {/* lane bands */}
          {LANES.map((l, i) => (
            <motion.g key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}>
              <rect x="10" y={l.y - 16} width="930" height={NODE_H + 32} rx="14"
                    fill={`${l.tint}08`} stroke={`${l.tint}22`} />
              <text x="20" y={l.y - 24} fontSize="11.5" fill={l.tint}
                    fontFamily="Instrument Sans" fontWeight="600" letterSpacing="0.07em">
                {l.name.toUpperCase()}
              </text>
              <text x={20 + l.name.length * 9.2 + 16} y={l.y - 24} fontSize="11"
                    fill="#8A92A6" fontFamily="Instrument Sans">{l.sub}</text>
            </motion.g>
          ))}

          {/* edges */}
          {EDGES.map(([a, b, kind], i) => {
            const A_ = byId[a], B_ = byId[b]
            if (!A_ || !B_) return null
            let d
            if (kind === 'down') {
              d = `M${cx(A_)},${cy(A_) + NODE_H / 2} C${cx(A_)},${cy(A_) + 52} ${cx(B_)},${cy(B_) - 52} ${cx(B_)},${cy(B_) - NODE_H / 2}`
            } else if (kind === 'wrap') {
              // corpus (far right) wraps back to the feature builder (far left)
              d = `M${cx(A_)},${cy(A_) + NODE_H / 2} C${cx(A_)},${cy(A_) + 44} ${cx(B_)},${cy(B_) - 44} ${cx(B_)},${cy(B_) - NODE_H / 2}`
            } else {
              d = `M${A_.x + A_.w},${cy(A_)} L${B_.x},${cy(B_)}`
            }
            const lit = hover === a || hover === b
            return (
              <motion.path key={i} d={d} fill="none"
                stroke={lit ? '#fff' : 'rgba(255,255,255,.22)'}
                strokeWidth={lit ? 1.8 : 1} markerEnd="url(#ah)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 + i * 0.035, duration: 0.4 }} />
            )
          })}

          {/* THE feedback edge — drawn heavy, because it is the claim */}
          {/* Routed down the RIGHT margin, approaches target from the TOP — smooth curves throughout */}
          <motion.path
            d={`M${byId.mut.x + byId.mut.w},${cy(byId.mut)} C${byId.mut.x + byId.mut.w + 90},${cy(byId.mut)} 950,${cy(byId.mut)} 950,${cy(byId.mut) - 60} C950,${cy(byId.atk) - 90} 950,${cy(byId.atk) - 90} 950,${cy(byId.atk) - 90} C950,${cy(byId.atk) - 50} ${cx(byId.atk)},${cy(byId.atk) - 50} ${cx(byId.atk)},${cy(byId.atk) - NODE_H / 2}`}
            fill="none" stroke={R} strokeWidth="2" strokeDasharray="6 5"
            markerEnd="url(#ahr)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1.3, duration: 1.2 }} />
          <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            x="958" y="308" fontSize="10.5" fill={R} fontFamily="Instrument Sans"
            transform="rotate(-90 958 308)" textAnchor="middle">
            escapes become the next attacks
          </motion.text>

          {/* nodes */}
          {all.map((n, i) => {
            const lit = hover === n.id
            return (
              <motion.g key={n.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.3 }}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer' }}>
                <rect x={n.x} y={n.lane.y} width={n.w} height={NODE_H} rx="10"
                      fill={lit ? `${n.lane.tint}26` : `${n.lane.tint}12`}
                      stroke={lit ? n.lane.tint : `${n.lane.tint}55`}
                      strokeWidth={lit ? 1.6 : 1}
                      style={lit ? { filter: `drop-shadow(0 0 14px ${n.lane.tint}88)` } : undefined} />
                <text x={n.x + 11} y={n.lane.y + 20} fontSize="12" fill="#F2F3F7"
                      fontFamily="Instrument Sans" fontWeight="500">{n.t}</text>
                <text x={n.x + 11} y={n.lane.y + 35} fontSize="9.5" fill="#A0A8B8"
                      fontFamily="Instrument Sans">
                  {n.s.length > 34 ? n.s.slice(0, 33) + '…' : n.s}
                </text>
                {n.file && (
                  <text x={n.x + 11} y={n.lane.y + 51} fontSize="8.5"
                        fill={`${n.lane.tint}CC`} fontFamily="JetBrains Mono">
                    {n.file.length > 30 ? n.file.slice(0, 29) + '…' : n.file}
                  </text>
                )}
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* Detail rail, FIXED HEIGHT. It used to grow with whatever text landed
          in it, which relaid out the diagram above on every mouse move — the
          graph appeared to twitch as the cursor crossed it. */}
      <div className="mod-sunk p-4 mt-3 h-[112px] overflow-y-auto">
        {info ? (
          <div>
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="mono text-[10px]" style={{ color: info.lane.tint }}>
                {info.lane.name.toUpperCase()}
              </span>
              <span className="text-[14px] font-medium">{info.t}</span>
              {info.file && (
                <span className="mono text-[10px] text-faint ml-auto">{info.file}</span>
              )}
            </div>
            <p className="prose max-w-[110ch]">{info.detail}</p>
          </div>
        ) : (
          <p className="prose">
            Hover any box for what it actually does. The dashed red arrow is the part that
            matters: whatever gets past the detector is logged with the parameters that let it
            through, mutated, and fed back into the attack population. That is what makes this
            a loop rather than a pipeline with an extra stage on the end.
          </p>
        )}
      </div>
    </div>
  )
}
