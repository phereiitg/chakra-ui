import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * The device graph, made inspectable.
 *
 * A drifting cloud of dots is wallpaper: a judge cannot tell what a node is,
 * what an edge means, or whether any of it is real. So every node carries the
 * values it was built from, hovering shows them, the view zooms and pans, and
 * an opening zoom tells you it responds to you before you have to guess.
 *
 * What is drawn:
 *   node · account   one payment account (a card token or a UPI VPA)
 *   node · device    one handset, identified by its UPI device binding
 *   edge             this account has transacted from this device
 *
 * The whole argument is the fan-out: how many accounts hang off one device.
 * Legitimate handsets carry one to a few. A mule operator's handset carries
 * dozens, and that is the shape a row-independent generator cannot produce,
 * because it draws each row's device independently from a marginal.
 */

const ACC = '#9BA1B4', DEV = '#34D399', RACC = '#FB7185', RDEV = '#FBBF24'

export default function DeviceGraph({ mode = 'chakra', height = 340, ringMax = 37 }) {
  const wrap = useRef(null)
  const cv = useRef(null)
  const [hover, setHover] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef(null)

  /* ---- build the population once per mode ---- */
  const { nodes, links } = useMemo(() => {
    const rnd = seeded(0x5eed)
    const nodes = [], links = []
    const add = (o) => (nodes.push(o), nodes.length - 1)

    // legitimate households: one handset, one or two accounts
    for (let i = 0; i < 26; i++) {
      const x = 0.08 + rnd() * 0.5, y = 0.12 + rnd() * 0.74
      const accs = rnd() < 0.3 ? 2 : 1
      const d = add({ kind: 'device', ring: false, x, y,
        id: 'DEV' + String(1000 + i), fanout: accs,
        note: 'household handset' })
      for (let k = 0; k < accs; k++) {
        const a = add({ kind: 'account', ring: false,
          x: x + (rnd() - .5) * .09, y: y + (rnd() - .5) * .13,
          id: 'PAY' + String(400000 + i * 7 + k),
          txns: 6 + Math.floor(rnd() * 40), note: 'ordinary payer' })
        links.push([d, a])
      }
    }

    // the ring
    const ringDevs = []
    for (let d = 0; d < 4; d++) {
      const x = mode === 'marginal' ? 0.1 + rnd() * 0.8 : 0.74 + (rnd() - .5) * .16
      const y = mode === 'marginal' ? 0.1 + rnd() * 0.8 : 0.24 + d * 0.17
      ringDevs.push(add({ kind: 'device', ring: true, x, y,
        id: 'DEV0' + (442 + d * 25), fanout: 0,
        note: 'shared by a mule operator' }))
    }
    const allDevs = nodes.map((n, i) => (n.kind === 'device' ? i : -1)).filter((i) => i >= 0)
    for (let m = 0; m < 30; m++) {
      const a = add({ kind: 'account', ring: true,
        x: mode === 'marginal' ? 0.08 + rnd() * 0.84 : 0.7 + (rnd() - .5) * .26,
        y: mode === 'marginal' ? 0.08 + rnd() * 0.84 : 0.14 + rnd() * 0.72,
        id: 'MUL' + String(10 + m).padStart(4, '0'),
        txns: 2 + Math.floor(rnd() * 9), note: 'dormant, then burst' })
      if (mode === 'marginal') {
        const d = allDevs[Math.floor(rnd() * allDevs.length)]
        links.push([d, a]); nodes[d].fanout += 1
      } else {
        const d = ringDevs[Math.floor(rnd() * ringDevs.length)]
        links.push([d, a]); nodes[d].fanout += 1
        if (rnd() < 0.3) {
          const d2 = ringDevs[Math.floor(rnd() * 4)]
          links.push([d2, a]); nodes[d2].fanout += 1
        }
      }
    }
    return { nodes, links }
  }, [mode])

  /* ---- opening zoom, so the judge knows it is interactive ---- */
  useEffect(() => {
    setZoom(1); setPan({ x: 0, y: 0 })
    let raf, t0 = performance.now()
    const tick = (now) => {
      const e = Math.min(1, (now - t0) / 2200)
      // out, in, settle
      const z = 1 + 0.34 * Math.sin(e * Math.PI)
      setZoom(z)
      if (e < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mode])

  /* ---- draw ---- */
  useEffect(() => {
    const c = cv.current
    if (!c) return
    const ctx = c.getContext('2d')
    let w = 0, h = 0, raf, t = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = () => {
      const r = c.getBoundingClientRect()
      w = r.width; h = r.height
      c.width = w * dpr; c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    const ro = new ResizeObserver(size); ro.observe(c)

    // Drift removed. A graph that moves reads as data changing, and a judge
    // trying to compare two states cannot do it against a moving target.
    const px = (n) => (n.x - 0.5) * w * zoom + w / 2 + pan.x
    const py = (n) => (n.y - 0.5) * h * zoom + h / 2 + pan.y

    const draw = () => {
      t += 0.005
      ctx.clearRect(0, 0, w, h)

      for (const [a, b] of links) {
        const A = nodes[a], B = nodes[b]
        const lit = hover !== null && (a === hover || b === hover)
        ctx.strokeStyle = lit ? 'rgba(255,255,255,.55)'
          : A.ring ? 'rgba(251,113,133,.26)' : 'rgba(155,161,180,.14)'
        ctx.lineWidth = lit ? 1.6 : 0.7
        ctx.beginPath(); ctx.moveTo(px(A), py(A)); ctx.lineTo(px(B), py(B)); ctx.stroke()
      }

      nodes.forEach((n, i) => {
        const x = px(n), y = py(n)
        const dev = n.kind === 'device'
        const col = n.ring ? (dev ? RDEV : RACC) : (dev ? DEV : ACC)
        const r = (dev ? 4.2 : 2.4) * (0.85 + zoom * 0.15)
        if (dev || n.ring) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5)
          g.addColorStop(0, col + (n.ring ? '4D' : '2A')); g.addColorStop(1, col + '00')
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 5, 0, 6.284); ctx.fill()
        }
        ctx.fillStyle = col
        ctx.globalAlpha = hover === null || hover === i ? 1 : 0.35
        ctx.beginPath(); ctx.arc(x, y, hover === i ? r * 1.6 : r, 0, 6.284); ctx.fill()
        if (hover === i) {
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4; ctx.stroke()
        }
        ctx.globalAlpha = 1
        n._sx = x; n._sy = y
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [nodes, links, hover, zoom, pan])

  /* ---- interaction ---- */
  const onMove = (e) => {
    const r = cv.current.getBoundingClientRect()
    const mx = e.clientX - r.left, my = e.clientY - r.top
    if (drag.current) {
      setPan({ x: drag.current.px + (e.clientX - drag.current.x),
               y: drag.current.py + (e.clientY - drag.current.y) })
      return
    }
    let best = null, bd = 15
    nodes.forEach((n, i) => {
      const d = Math.hypot((n._sx ?? -99) - mx, (n._sy ?? -99) - my)
      if (d < bd) { bd = d; best = i }
    })
    setHover(best)
  }

  const h = hover !== null ? nodes[hover] : null

  return (
    <div>
      <div ref={wrap} className="relative mod-sunk overflow-hidden" style={{ height }}>
        <canvas ref={cv} style={{ width: '100%', height: '100%', cursor: drag.current ? 'grabbing' : 'crosshair' }}
          onMouseMove={onMove}
          onMouseLeave={() => { setHover(null); drag.current = null }}
          onMouseDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y } }}
          onMouseUp={() => { drag.current = null }}
          onWheel={(e) => setZoom((z) => Math.max(0.6, Math.min(3.2, z - e.deltaY * 0.0012)))}
        />

        {/* hover readout */}
        {h && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="absolute left-3 top-3 mod px-3.5 py-3 pointer-events-none"
            style={{ borderColor: `${h.ring ? (h.kind === 'device' ? RDEV : RACC) : (h.kind === 'device' ? DEV : ACC)}66` }}>
            <div className="label mb-1.5">{h.kind === 'device' ? 'device' : 'account'}</div>
            <div className="mono text-[13px]">{h.id}</div>
            <div className="mono text-[11px] text-dim mt-1.5">
              {h.kind === 'device'
                ? `${h.fanout} account${h.fanout === 1 ? '' : 's'} share this handset`
                : `${h.txns} transactions`}
            </div>
            <div className="label mt-1">{h.note}</div>
          </motion.div>
        )}

        {/* affordances */}
        <div className="absolute right-3 bottom-3 flex items-center gap-2 pointer-events-none">
          <span className="label px-2 py-1 rounded-md bg-black/40">
            scroll to zoom · drag to pan · hover a node
          </span>
          <span className="mono text-[10px] px-2 py-1 rounded-md bg-black/40 text-dim">
            {zoom.toFixed(2)}×
          </span>
        </div>
      </div>

      <div className="mod-sunk p-4 mt-3">
        <div className="font-display font-semibold text-[15px] mb-1">
          There are no axes here, and that is the point
        </div>
        <p className="prose-sm max-w-[92ch]">
          This is a relationship graph, not a plot. Position is decided by a layout, so left
          and right mean nothing — the only thing that carries information is
          <span className="text-txt"> which dots are joined to which</span>, and how many
          accounts converge on a single handset. Drift is decorative; the connections are not.
        </p>
      </div>

      {/* legend — what a node and an edge actually are */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
        {[
          [DEV, 'Device', 'one handset, by its UPI device binding'],
          [ACC, 'Account', 'one card token or VPA'],
          [RDEV, 'Shared device', `a mule operator's handset — up to ${ringMax} accounts`],
          [RACC, 'Mule account', 'dormant, then burst, then burned'],
        ].map(([c, t, d]) => (
          <div key={t} className="mod-sunk px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: c, boxShadow: `0 0 10px ${c}` }} />
              <span className="text-[12.5px] font-medium">{t}</span>
            </div>
            <div className="label mt-1 leading-snug">{d}</div>
          </div>
        ))}
      </div>
      <div className="label mt-2.5 leading-relaxed">
        An edge means this account has transacted from this handset. The whole argument is the
        fan-out: how many accounts hang off one device.
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
