import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * Mathematics, typeset properly.
 *
 * Monospace ASCII approximations of an equation — `sum_i log [ P(e|Y=1) /
 * P(e|Y=0) ]` — read as code, not as maths. Anyone who works with these
 * expressions has to translate them back before they can check them, and a
 * judge glancing at a screen simply will not.
 *
 * KaTeX renders the real thing: proper fractions, real summation signs,
 * subscripts where subscripts belong. It runs synchronously at render time
 * with no network call, so it costs nothing at display.
 */

function render(tex, display) {
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      // The colour has to be set here rather than in CSS, because KaTeX emits
      // its own spans and inheriting through them is unreliable across
      // browsers.
      macros: { '\\R': '\\mathbb{R}' },
    })
  } catch {
    return tex
  }
}

/** Inline maths, sitting inside a sentence. */
export function M({ children, tint }) {
  const html = useMemo(() => render(children, false), [children])
  return (
    <span className="katex-inline" style={tint ? { color: tint } : undefined}
          dangerouslySetInnerHTML={{ __html: html }} />
  )
}

/** A displayed equation, centred on its own line. */
export function Eq({ children, tint, size = 1 }) {
  const html = useMemo(() => render(children, true), [children])
  return (
    <div className="katex-block"
         style={{ fontSize: `${size}em`, color: tint || undefined }}
         dangerouslySetInnerHTML={{ __html: html }} />
  )
}

/** Several equations in a stack, with optional annotations to the right. */
export function EqStack({ rows, tint }) {
  return (
    <div className="space-y-2.5">
      {rows.map(([tex, note], i) => (
        <div key={i} className="flex items-baseline gap-4 flex-wrap">
          <div className="katex-block !my-0" style={{ color: tint || undefined }}
               dangerouslySetInnerHTML={{ __html: render(tex, true) }} />
          {note && <span className="label flex-1 min-w-[140px]">{note}</span>}
        </div>
      ))}
    </div>
  )
}
