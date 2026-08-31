import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * The guide.
 *
 * Lives in the left rail, in the reading path, and types itself out so the eye
 * is pulled to it before the visual. The advance control sits directly beneath
 * the sentence rather than in a far corner, and it bounces gently so a judge
 * who has stopped reading still knows where to go next.
 */
export default function Guide({ text, tint }) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setShown(''); setDone(false)
    let i = 0, t
    const step = () => {
      i += 1
      setShown(text.slice(0, i))
      if (i < text.length) {
        const c = text[i - 1]
        t = setTimeout(step, '.?!'.includes(c) ? 190 : ',;:—'.includes(c) ? 90 : 12)
      } else setDone(true)
    }
    t = setTimeout(step, 220)
    return () => clearTimeout(t)
  }, [text])

  return (
    <div className="flex items-start gap-3">
      <motion.div className="relative shrink-0 w-[26px] h-[26px] mt-[3px]"
                  animate={{ scale: done ? 1 : [1, 1.1, 1] }}
                  transition={{ duration: 1.3, repeat: done ? 0 : Infinity }}>
        <div className="absolute inset-0 rounded-full"
             style={{ background: `radial-gradient(circle at 34% 30%, ${tint}, ${tint}18 62%, transparent 74%)` }} />
        <div className="absolute inset-[8px] rounded-full"
             style={{ background: tint, boxShadow: `0 0 16px ${tint}` }} />
        {!done && (
          <motion.div className="absolute inset-0"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}>
            <div className="absolute left-1/2 -top-px w-1 h-1 rounded-full -translate-x-1/2"
                 style={{ background: tint, boxShadow: `0 0 8px ${tint}` }} />
          </motion.div>
        )}
      </motion.div>

      <p onClick={() => { setShown(text); setDone(true) }}
         className="text-[16.5px] leading-[1.6] text-txt cursor-default">
        {shown}
        {!done && (
          <motion.span className="inline-block w-[2px] h-[14px] align-middle ml-[2px]"
                       style={{ background: tint }}
                       animate={{ opacity: [1, 0, 1] }}
                       transition={{ duration: 0.85, repeat: Infinity }} />
        )}
      </p>
    </div>
  )
}
