export function init() {
  if (typeof gsap === 'undefined') return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.querySelectorAll('.logo_component').forEach(setupMarquee)
}

function setupMarquee(marquee) {
  const content = marquee.firstElementChild
  if (!content || !content.children.length) return

  const originalHTML = content.innerHTML
  const isRight = marquee.dataset.direction === 'right'
  // Durée d'un tour complet en secondes (plus c'est grand, plus c'est lent), réglable via data-speed
  const speed = +marquee.dataset.speed || 30

  let tl = null
  let lastWidth = 0

  const build = () => {
    const width = marquee.offsetWidth
    if (!width || width === lastWidth) return
    lastWidth = width

    const progress = tl ? tl.progress() : 0
    const paused = tl ? tl.paused() : false
    if (tl) tl.kill()
    content.innerHTML = originalHTML
    gsap.set(content, { clearProps: 'transform' })

    const items = [...content.children]
    const first = items[0]
    const last = items[items.length - 1]
    const setWidth = last.offsetLeft + last.offsetWidth - first.offsetLeft
    if (!setWidth) return

    // Assez de copies pour couvrir la largeur visible, quel que soit l'écran
    const copies = Math.ceil(width / setWidth) + 1
    for (let i = 0; i < copies; i++) {
      items.forEach((item) => {
        const clone = item.cloneNode(true)
        clone.setAttribute('aria-hidden', 'true')
        content.appendChild(clone)
      })
    }

    // Distance d'un tour mesurée en pixels (espacements compris, padding de la liste exclu) pour une boucle sans saut
    const distance = content.children[items.length].offsetLeft - first.offsetLeft
    const wrap = gsap.utils.wrap(-distance, 0)

    gsap.set(content, { force3D: true, x: isRight ? -distance : 0 })
    tl = gsap.to(content, {
      x: isRight ? 0 : -distance,
      duration: speed,
      ease: 'none',
      repeat: -1,
      modifiers: { x: (x) => wrap(parseFloat(x)) + 'px' },
    })
    tl.progress(progress)
    if (paused) tl.pause()
  }

  marquee.addEventListener('mouseenter', () => tl && tl.pause())
  marquee.addEventListener('mouseleave', () => tl && tl.play())

  build()
  // Recalcule si la largeur change (redimensionnement, logos chargés après coup)
  new ResizeObserver(build).observe(marquee)
  window.addEventListener('load', () => {
    lastWidth = 0
    build()
  })
}
