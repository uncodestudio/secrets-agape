const OFFSET_Y = 800
const MOBILE_BREAKPOINT = 991
const DURATION_IN = 0.8
const DURATION_OUT = 0.5
const EASE_IN = 'power3.out'
const EASE_OUT = 'power2.in'

export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return

  const trigger = document.querySelector('.product-filter_wrapper')
  const modal = document.querySelector('.product_modal-wrapper')
  const form = document.querySelector('.product_form-block')
  const source = document.querySelector('.product-list_filter-wrapper')
  const component = document.querySelector('.product-filter_component')
  if (!trigger || !modal || !form || !source) return

  gsap.registerPlugin(ScrollTrigger)

  // Un parent avec transform/filter casse le position: fixed : la modale est remontée à la racine du body
  document.body.appendChild(modal)

  const contents = document.querySelectorAll('.product-filter_content')
  const button = document.querySelector('.product-modal_button')
  const icon = document.querySelector('.product-modal_icon')
  const divider = document.querySelector('.product-modal_divider')
  let isOpen = false

  // Anime la propriété CSS `translate` plutôt que `transform`, pour ne pas écraser le positionnement Webflow
  const slide = { y: OFFSET_Y }
  const renderSlide = () => (modal.style.translate = `0 ${slide.y}px`)
  renderSlide()

  const setModalClasses = (active) => {
    component?.classList.toggle('is-modal', active)
    // Mise en page du mode modale gérée en custom CSS (voir .layout-is-modal dans Webflow)
    contents.forEach((el) => el.classList.toggle('layout-is-modal', active))
  }

  const setClosedClasses = (closed) => {
    divider?.classList.toggle('is-close', closed)
    component?.classList.toggle('is-close', closed)
    form.style.display = closed ? 'none' : ''
  }

  const resetContents = () => {
    gsap.killTweensOf(contents)
    gsap.set(contents, { clearProps: 'opacity,transform' })
  }

  const revealContents = () => {
    gsap.killTweensOf(contents)
    gsap.fromTo(
      contents,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: EASE_IN, stagger: 0.06, clearProps: 'opacity,transform' }
    )
  }

  const setOpen = (open, animate = true) => {
    isOpen = open
    if (icon) gsap.to(icon, { rotation: open ? 45 : 0, duration: 0.5, ease: EASE_IN })

    if (!animate) {
      resetContents()
      setClosedClasses(!open)
      return
    }

    if (open) {
      setClosedClasses(false)
      revealContents()
    } else {
      gsap.killTweensOf(contents)
      // Les filtres disparaissent avant que .is-close ne referme la modale
      gsap.to(contents, {
        opacity: 0,
        y: 16,
        duration: 0.25,
        ease: EASE_OUT,
        stagger: { each: 0.03, from: 'end' },
        onComplete: () => {
          setClosedClasses(true)
          gsap.set(contents, { clearProps: 'opacity,transform' })
        },
      })
    }
  }

  const slideIn = () =>
    gsap.to(slide, { y: 0, duration: DURATION_IN, ease: EASE_IN, overwrite: true, onUpdate: renderSlide })

  const slideOut = () =>
    gsap.to(slide, { y: OFFSET_Y, duration: DURATION_OUT, ease: EASE_OUT, overwrite: true, onUpdate: renderSlide })

  const show = () => {
    // Réserve la hauteur de l'emplacement d'origine pour éviter un saut de scroll quand le form en sort
    source.style.minHeight = `${source.offsetHeight}px`
    modal.appendChild(form)
    setModalClasses(true)
    // La modale arrive toujours fermée
    setOpen(false, false)
    slideIn()
  }

  const hide = () => {
    // Le form revient tout de suite à sa place et les filtres réapparaissent en cascade pendant que la modale descend
    source.appendChild(form)
    source.style.minHeight = ''
    setModalClasses(false)
    // Le divider garde son état : la modale est encore visible pendant qu'elle descend
    component?.classList.remove('is-close')
    form.style.display = ''
    revealContents()

    if (isOpen) {
      isOpen = false
      if (icon) gsap.to(icon, { rotation: 0, duration: 0.5, ease: EASE_IN })
    }

    slideOut()
  }

  // Remet le form à sa place et la modale hors écran, sans animation (changement de breakpoint)
  const reset = () => {
    gsap.killTweensOf(slide)
    slide.y = OFFSET_Y
    renderSlide()
    source.appendChild(form)
    source.style.minHeight = ''
    setModalClasses(false)
    component?.classList.remove('is-close')
    divider?.classList.remove('is-close')
    form.style.display = ''
    resetContents()
    isOpen = false
    if (icon) gsap.set(icon, { rotation: 0 })
  }

  const listSection = document.querySelector('.section_product-list')
  const mm = gsap.matchMedia()

  mm.add(`(min-width: ${MOBILE_BREAKPOINT + 1}px)`, () => {
    ScrollTrigger.create({
      trigger,
      start: 'bottom top',
      onEnter: show,
      onLeaveBack: hide,
    })

    // La modale sort de l'écran une fois la liste produits dépassée, et revient quand on remonte
    if (listSection) {
      ScrollTrigger.create({
        trigger: listSection,
        start: 'bottom top',
        onEnter: slideOut,
        onLeaveBack: slideIn,
      })
    }

    return reset
  })

  // Tablette et mobile : pas de version dans la sidebar, le form vit dans la modale qui suit la liste produits
  mm.add(`(max-width: ${MOBILE_BREAKPOINT}px)`, () => {
    if (!listSection) return

    modal.appendChild(form)
    setModalClasses(true)
    setOpen(false, false)

    ScrollTrigger.create({
      trigger: listSection,
      start: 'top center',
      end: 'bottom top',
      onEnter: slideIn,
      onLeave: slideOut,
      onEnterBack: slideIn,
      onLeaveBack: slideOut,
    })

    return reset
  })

  button?.addEventListener('click', () => setOpen(!isOpen))
}
