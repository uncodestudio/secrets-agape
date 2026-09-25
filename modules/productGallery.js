const SPEED = 800
const EASING = 'cubic-bezier(0.215, 0.61, 0.355, 1)' // power3.out, comme le reste du site

export function init() {
  if (typeof Splide === 'undefined') return

  const mainEl = document.querySelector('.product-gallery_main')
  const thumbsEl = document.querySelector('.product-gallery_thumbs')
  if (!mainEl || !thumbsEl) return

  // Les flèches de la grande image (tablette) et les vignettes (desktop) sont affichées ou masquées en CSS dans Webflow
  const mainArrows = mainEl.querySelector('.splide__arrows')

  const main = new Splide(mainEl, {
    type: 'fade',
    rewind: true,
    speed: SPEED,
    easing: EASING,
    arrows: !!mainArrows,
    pagination: false,
  })

  const thumbs = new Splide(thumbsEl, {
    type: 'loop',
    perPage: 4,
    gap: '0.5rem',
    speed: SPEED,
    easing: EASING,
    pagination: false,
    isNavigation: true,
    updateOnMove: true,
    // La vignette active est toujours calée à gauche, la liste tourne en boucle
    focus: 0,
  })

  // Recopie .is-active de la slide sur l'image, pour pouvoir la styler directement dans Webflow
  const toggleThumbActive = (active) => ({ slide }) =>
    slide.querySelector('.product_image-thumbnail')?.classList.toggle('is-active', active)
  thumbs.on('active', toggleThumbActive(true))
  thumbs.on('inactive', toggleThumbActive(false))

  main.sync(thumbs)
  main.mount()
  thumbs.mount()
}
