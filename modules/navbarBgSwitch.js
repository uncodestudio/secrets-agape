const TARGET_SELECTORS = [
  '.navbar-logo_image',
  '.navbar_link',
  '.wishlist_link',
  '.navbar_button',
  '.menu-icon-top',
  '.menu-icon-middle',
  '.menu-icon-bottom',
]

export function init() {
  const navbar = document.querySelector('.navbar_component')
  const blurSections = document.querySelectorAll('[data-bg-blur]')
  if (!navbar || !blurSections.length) return

  const targets = [
    navbar,
    ...TARGET_SELECTORS.flatMap((selector) => Array.from(navbar.querySelectorAll(selector))).filter(
      (el) => !el.matches('.wishlist_link.is-mobile')
    ),
  ]

  const activeSections = new Set()
  let observer

  // Tablette et mobile : les liens sont dans le menu déroulant, ils ne changent pas de style
  const tabletQuery = window.matchMedia('(max-width: 991px)')

  const applyState = () => {
    const isBlured = activeSections.size > 0
    targets.forEach((el) => {
      const skip = tabletQuery.matches && el.matches('.navbar_link')
      el.classList.toggle('is-blured', isBlured && !skip)
    })
  }

  const handleEntries = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activeSections.add(entry.target)
      else activeSections.delete(entry.target)
    })
    applyState()
  }

  const createObserver = () => {
    if (observer) observer.disconnect()
    activeSections.clear()

    const navHeight = navbar.getBoundingClientRect().height
    observer = new IntersectionObserver(handleEntries, {
      rootMargin: `0px 0px -${window.innerHeight - navHeight}px 0px`,
      threshold: 0,
    })
    blurSections.forEach((section) => observer.observe(section))
  }

  createObserver()

  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(createObserver, 200)
  })
}
