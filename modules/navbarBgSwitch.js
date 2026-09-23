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
  const darkSections = document.querySelectorAll('[data-bg-dark]')
  if (!navbar || !darkSections.length) return

  const targets = TARGET_SELECTORS.flatMap((selector) => Array.from(navbar.querySelectorAll(selector)))
  if (!targets.length) return

  const activeSections = new Set()
  let observer

  const applyState = () => {
    const isWhite = activeSections.size > 0
    targets.forEach((el) => el.classList.toggle('is-white', isWhite))
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
    darkSections.forEach((section) => observer.observe(section))
  }

  createObserver()

  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(createObserver, 200)
  })
}
