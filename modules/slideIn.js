const OFFSET_Y = 60
const DURATION = 1.1
const EASE = 'power3.out'

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
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
  })
}
