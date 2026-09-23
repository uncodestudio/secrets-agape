const PARALLAX_AMOUNT = 15

export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return

  gsap.registerPlugin(ScrollTrigger)

  document.querySelectorAll('.home-showroom_image').forEach((el) => {
    gsap.fromTo(
      el,
      { yPercent: -PARALLAX_AMOUNT },
      {
        yPercent: PARALLAX_AMOUNT,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
  })
}
