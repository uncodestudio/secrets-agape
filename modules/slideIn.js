// Apparition douce : petit décalage, durée longue, décélération progressive
const OFFSET_Y = 32
const DURATION = 1.6
const EASE = 'power2.out'

export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return

  gsap.registerPlugin(ScrollTrigger)

  document.querySelectorAll('[data-slide-in]').forEach((el) => {
    gsap.set(el, { y: OFFSET_Y, opacity: 0 })

    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: DURATION,
      ease: EASE,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    })
  })
}
