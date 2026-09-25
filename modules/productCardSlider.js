// Sliders de cartes produits (accessoires, robes similaires) : même comportement pour chaque variante
const SELECTOR = '.splide.is-accessoires, .splide.is-robes'

// Nombre de slides visibles par breakpoint Webflow (desktop, tablette, mobile paysage, mobile portrait)
const PER_PAGE = 4
const BREAKPOINTS = {
  991: { perPage: 2.5 },
  767: { perPage: 1.75 },
  479: { perPage: 1.5 },
}

// La page se recharge au changement de breakpoint (main.js), donc une lecture au chargement suffit
const currentPerPage = () => {
  const match = Object.keys(BREAKPOINTS)
    .map(Number)
    .sort((a, b) => a - b)
    .find((bp) => window.matchMedia(`(max-width: ${bp}px)`).matches)
  return match ? BREAKPOINTS[match].perPage : PER_PAGE
}

export function init() {
  if (typeof Splide === 'undefined') return

  const perPage = currentPerPage()

  document.querySelectorAll(SELECTOR).forEach((el) => {
    const arrows = el.querySelector('.splide__arrows')
    // Tout tient à l'écran : les flèches de ce slider ne servent à rien
    const fitsInView = el.querySelectorAll('.splide__slide').length <= perPage
    if (arrows && fitsInView) arrows.style.display = 'none'

    new Splide(el, {
      type: 'slide',
      perPage: PER_PAGE,
      breakpoints: BREAKPOINTS,
      perMove: 1,
      // Au départ, la première slide est calée à gauche : ça ne déborde que vers la droite
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
