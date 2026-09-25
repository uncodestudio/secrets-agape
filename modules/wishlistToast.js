// Modales de confirmation (ajout / retrait) qui glissent depuis le bas de l'écran
const DISPLAY_DURATION = 5000
const MARGIN = 24

export function createWishlistToasts() {
  const els = {
    add: document.querySelector('.add-wishlist_modal'),
    remove: document.querySelector('.remove-wishlist_modal'),
  }

  const toasts = Object.fromEntries(
    Object.entries(els)
      .filter(([, el]) => el)
      .map(([name, el]) => {
        // Un parent avec transform casserait le position: fixed réglé dans Webflow
        document.body.appendChild(el)
        el.setAttribute('role', 'status')
        el.setAttribute('aria-live', 'polite')

        // Anime la propriété CSS `translate` pour ne pas écraser le transform Webflow
        const state = { el, y: window.innerHeight, timer: null, visible: false }
        state.render = () => (el.style.translate = `0 ${state.y}px`)
        state.render()
        return [name, state]
      })
  )

  // Distance pour sortir complètement par le bas, depuis la position Webflow
  const hiddenOffset = (state) => window.innerHeight - (state.el.getBoundingClientRect().top - state.y) + MARGIN

  const hide = (state) => {
    clearTimeout(state.timer)
    if (!state.visible) return
    state.visible = false
    gsap.to(state, {
      y: hiddenOffset(state),
      duration: 0.5,
      ease: 'power2.in',
      overwrite: true,
      onUpdate: state.render,
    })
  }

  const show = (name) => {
    const state = toasts[name]
    if (!state || typeof gsap === 'undefined') return

    // Chaque clic relance l'animation depuis le bas, même si une modale est déjà affichée :
    // les autres modales disparaissent instantanément
    Object.values(toasts).forEach((other) => {
      clearTimeout(other.timer)
      gsap.killTweensOf(other)
      other.visible = false
      other.y = hiddenOffset(other)
      other.render()
    })

    state.visible = true
    gsap.to(state, { y: 0, duration: 0.8, ease: 'expo.out', overwrite: true, onUpdate: state.render })
    state.timer = setTimeout(() => hide(state), DISPLAY_DURATION)
  }

  return { show }
}
