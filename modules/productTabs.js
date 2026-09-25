const TAB_ATTR = 'datatab'
const ACTIVE_ATTR = 'activetab'
const ACTIVE_VALUE = 'is-active'

export function init() {
  const tabs = document.querySelectorAll('.product-header_tab-item')
  const panels = document.querySelectorAll('.product-header_content-wrapper')
  if (!tabs.length || !panels.length) return

  let timeline

  const setActive = (key, animate = true) => {
    tabs.forEach((tab) => {
      const active = tab.getAttribute(TAB_ATTR) === key
      tab.classList.toggle('is-active', active)
      tab.querySelector('.product-header_tab-underline')?.classList.toggle('is-active', active)
      tab.setAttribute('aria-selected', String(active))
      if (active) tab.setAttribute(ACTIVE_ATTR, ACTIVE_VALUE)
      else tab.removeAttribute(ACTIVE_ATTR)
    })

    const next = [...panels].find((panel) => panel.getAttribute(TAB_ATTR) === key)
    const current = [...panels].find((panel) => panel !== next && panel.style.display !== 'none')

    const showOnly = () =>
      panels.forEach((panel) => {
        const active = panel === next
        panel.style.display = active ? '' : 'none'
        if (active) panel.setAttribute(ACTIVE_ATTR, ACTIVE_VALUE)
        else panel.removeAttribute(ACTIVE_ATTR)
      })

    if (!animate || typeof gsap === 'undefined' || !next) {
      showOnly()
      return
    }

    // Fondu de sortie de l'ancien contenu, puis le nouveau glisse doucement en place
    // Un clic rapide sur un autre onglet annule la transition en cours
    timeline?.kill()
    gsap.set(panels, { clearProps: 'opacity,transform' })
    timeline = gsap
      .timeline()
      .to(current || [], { opacity: 0, duration: 0.25, ease: 'power2.in' })
      .add(() => {
        showOnly()
        if (current) gsap.set(current, { clearProps: 'opacity' })
      })
      .fromTo(
        next,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', clearProps: 'opacity,transform' }
      )
  }

  const initialTab =
    document.querySelector(`.product-header_tab-item[${ACTIVE_ATTR}="${ACTIVE_VALUE}"]`) || tabs[0]
  setActive(initialTab.getAttribute(TAB_ATTR), false)

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return
      setActive(tab.getAttribute(TAB_ATTR))
    })

    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      tab.click()
    })
  })
}
