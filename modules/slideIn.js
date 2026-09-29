// Apparition douce : petit décalage, durée longue, décélération progressive
const OFFSET_Y = 32
const DURATION = 1.6
const EASE = 'power2.out'
// Cascade plus dynamique : animations courtes qui se chevauchent
const STAGGER_DURATION = 0.8
const STAGGER_EASE = 'power3.out'
const DEFAULT_STAGGER = 0.2

const reveal = (targets, trigger, { stagger = 0, duration = DURATION, ease = EASE } = {}) => {
  gsap.set(targets, { y: OFFSET_Y, opacity: 0 })
  gsap.to(targets, {
    y: 0,
    opacity: 1,
    duration,
    ease,
    stagger,
    scrollTrigger: {
      trigger,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  })
}

export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return

  gsap.registerPlugin(ScrollTrigger)

  document.querySelectorAll('[data-slide-in]').forEach((el) => reveal(el, el))

  // Cascade : les enfants directs apparaissent l'un après l'autre.
  // La valeur de l'attribut règle le décalage en secondes (0.2 par défaut)
  document.querySelectorAll('[data-slide-in-stagger]').forEach((parent) => {
    const children = [...parent.children]
    if (!children.length) return
    const stagger = parseFloat(parent.dataset.slideInStagger) || DEFAULT_STAGGER
    reveal(children, parent, { stagger, duration: STAGGER_DURATION, ease: STAGGER_EASE })
  })
}
