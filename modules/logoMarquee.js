const BREAKPOINT = 991

export function init() {
  if (typeof gsap === 'undefined') return

  const mq = window.matchMedia(`(max-width: ${BREAKPOINT}px)`)
  document.querySelectorAll('.logo_component').forEach((marquee) => setupMarquee(marquee, mq))
}

function setupMarquee(marquee, mq) {
  const content = marquee.firstElementChild
  if (!content) return

  const originalHTML = content.innerHTML
  const isRight = marquee.dataset.direction === 'right'
  const speed = +marquee.dataset.speed || 15

  let tl = null
  let onEnter = null
  let onLeave = null

  const enable = () => {
    if (tl) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Duplication pour boucle infinie
    content.innerHTML = originalHTML + originalHTML

    // Force GPU
    gsap.set(content, {
      force3D: true,
      xPercent: isRight ? -50 : 0,
    })

    if (isRight) {
      // Droite → Gauche avec wrap seamless
      tl = gsap.to(content, {
        xPercent: 0,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          xPercent: gsap.utils.wrap(-50, 0),
        },
      })
    } else {
      // Gauche → Droite avec wrap seamless
      tl = gsap.to(content, {
        xPercent: -50,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          xPercent: gsap.utils.wrap(0, -50),
        },
      })
    }

    onEnter = () => tl.pause()
    onLeave = () => tl.play()
    marquee.addEventListener('mouseenter', onEnter)
    marquee.addEventListener('mouseleave', onLeave)
  }

  const disable = () => {
    if (!tl) return

    tl.kill()
    tl = null
    marquee.removeEventListener('mouseenter', onEnter)
    marquee.removeEventListener('mouseleave', onLeave)
    gsap.set(content, { clearProps: 'transform' })
    content.innerHTML = originalHTML
  }

  mq.addEventListener('change', (e) => (e.matches ? enable() : disable()))
  if (mq.matches) enable()
}
