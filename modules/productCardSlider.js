// Sliders de cartes produits (accessoires, robes similaires) : même comportement pour chaque variante
const SELECTOR = '.splide.is-accessoires, .splide.is-robes'
const PER_PAGE = 4

export function init() {
  if (typeof Splide === 'undefined') return

  document.querySelectorAll(SELECTOR).forEach((el) => {
    const arrows = el.querySelector('.splide__arrows')
    // Tout tient à l'écran : les flèches de ce slider ne servent à rien
    const fitsInView = el.querySelectorAll('.splide__slide').length <= PER_PAGE
    if (arrows && fitsInView) arrows.style.display = 'none'

    new Splide(el, {
      type: 'slide',
      perPage: PER_PAGE,
      perMove: 1,
      focus: 0,
      // S'arrête quand le dernier item est calé à droite, sans boucle
      trimSpace: true,
      rewind: false,
      gap: '0.25rem',
      speed: 800,
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', // power3.out, comme le reste du site
      pagination: false,
      // Utilise les flèches Webflow si elles existent, sans générer celles de Splide par défaut
      arrows: !!arrows && !fitsInView,
    }).mount()
  })
}
