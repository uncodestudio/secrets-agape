const VISIBLE_COUNT = 3
const log = (...args) => console.log('[productFilterToggle]', ...args) // DEBUG — à retirer

export function init() {
  if (typeof gsap === 'undefined') {
    log('GSAP absent, module stoppé')
    return
  }

  const groups = document.querySelectorAll('.product-filter_content')
  log(`${groups.length} .product-filter_content trouvé(s)`)
  groups.forEach(setupGroup)
}

function setupGroup(content, index) {
  const layout = content.querySelector('.product-filter_layout')
  const toggle = content.querySelector('.product_filter-open')
  log(`groupe ${index}`, JSON.stringify({
    texteDuGroupe: content.textContent.trim().replace(/\s+/g, ' ').slice(0, 60),
    nbLayoutsDansLeGroupe: content.querySelectorAll('.product-filter_layout').length,
    nbBoutonsDansLeGroupe: content.querySelectorAll('.product_filter-open').length,
    classesEnfantsDuLayout: layout ? [...layout.children].map((c) => c.className) : null,
  }, null, 2))
  if (!layout || !toggle) {
    log(`groupe ${index} stoppé : ${!layout ? '.product-filter_layout' : '.product_filter-open'} introuvable`)
    return
  }

  // Le bouton ne peut pas être placé dans la CMS list côté Webflow
  layout.appendChild(toggle)

  const allItems = layout.querySelectorAll('.product_filter-item')
  const hiddenItems = Array.from(allItems).slice(VISIBLE_COUNT)
  log(`groupe ${index} : ${allItems.length} items, ${hiddenItems.length} masqués`)
  if (!hiddenItems.length) {
    toggle.style.display = 'none'
    return
  }

  const icon = content.querySelector('.product_close-icon')
  log(`groupe ${index} : icon`, icon)
  let isOpen = false

  hiddenItems.forEach((item) => (item.style.display = 'none'))
  toggle.setAttribute('aria-expanded', 'false')

  if (toggle.tagName !== 'BUTTON') {
    toggle.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      toggle.click()
    })
  }

  toggle.addEventListener('click', () => {
    isOpen = !isOpen
    log(`groupe ${index} clic → ${isOpen ? 'ouvert' : 'fermé'}`)
    toggle.setAttribute('aria-expanded', String(isOpen))
    gsap.killTweensOf(hiddenItems)

    if (icon) gsap.to(icon, { rotation: isOpen ? 45 : 0, duration: 0.5, ease: 'power3.out' })

    if (isOpen) {
      hiddenItems.forEach((item) => (item.style.display = ''))
      gsap.fromTo(
        hiddenItems,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }
      )
    } else {
      gsap.to(hiddenItems, {
        opacity: 0,
        x: -16,
        duration: 0.25,
        ease: 'power2.in',
        stagger: { each: 0.03, from: 'end' },
        onComplete: () => hiddenItems.forEach((item) => (item.style.display = 'none')),
      })
    }
  })
}
