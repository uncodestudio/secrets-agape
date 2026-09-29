const OFFSET_Y = 40

export function init() {
  const wrapper = document.querySelector('.modal-share_wrapper')
  const content = wrapper?.querySelector('.modal_share-content')
  if (!wrapper || !content) return

  // Un parent avec transform casserait le position: fixed réglé dans Webflow
  document.body.appendChild(wrapper)
  wrapper.setAttribute('role', 'dialog')
  wrapper.setAttribute('aria-modal', 'true')
  wrapper.style.display = 'none'

  const hasGsap = typeof gsap !== 'undefined'
  let isOpen = false

  const open = () => {
    if (isOpen) return
    isOpen = true
    wrapper.style.display = 'flex'
    wrapper.style.alignItems = 'center'
    document.body.style.overflow = 'hidden'

    if (!hasGsap) return
    gsap.killTweensOf(content)
    gsap.fromTo(
      content,
      { y: OFFSET_Y, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', clearProps: 'transform,opacity' }
    )
  }

  const close = () => {
    if (!isOpen) return
    isOpen = false

    const hide = () => {
      wrapper.style.display = 'none'
      document.body.style.overflow = ''
    }

    if (!hasGsap) return hide()
    gsap.killTweensOf(content)
    gsap.to(content, {
      y: OFFSET_Y,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        hide()
        gsap.set(content, { clearProps: 'transform,opacity' })
      },
    })
  }

  // Délégation : fonctionne pour tous les déclencheurs de la page
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]')
    if (!trigger) return
    if (trigger.dataset.modal === 'open') {
      e.preventDefault()
      open()
    } else if (trigger.dataset.modal === 'close') {
      e.preventDefault()
      close()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })
}
