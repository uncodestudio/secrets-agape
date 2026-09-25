import { createWishlistToasts } from './wishlistToast.js'

// Wishlist stockée dans le navigateur (localStorage) : pas de compte, liée à l'appareil et au navigateur
const STORAGE_KEY = 'agape-wishlist'

const SELECTORS = {
  button: '[data-wishlist-button]', // cœur produit (liste, template, page wishlist)
  item: '[data-wishlist-item]', // carte produit sur la page wishlist
  section: '[data-wishlist-section]', // bloc Robes / Accessoires de la page wishlist
  empty: '[data-wishlist-empty]', // état vide de la page wishlist
  count: '[data-wishlist-count]', // compteur optionnel
  field: '[data-wishlist-field]', // champ caché optionnel du formulaire de rendez-vous
  nav: '.wishlist_link', // cœur(s) de la navbar
}

// ---------- Stockage ----------

const read = () => {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

const write = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Stockage indisponible (navigation privée stricte) : la wishlist ne sera pas conservée
  }
}

const keyOf = (el) => `${el.dataset.wishlistType}:${el.dataset.wishlistId}`
const has = (list, key) => list.some((p) => `${p.type}:${p.id}` === key)

const toggle = (el) => {
  const list = read()
  const key = keyOf(el)
  const next = has(list, key)
    ? list.filter((p) => `${p.type}:${p.id}` !== key)
    : [...list, { type: el.dataset.wishlistType, id: el.dataset.wishlistId, name: el.dataset.wishlistName || '' }]
  write(next)
  return next
}

// ---------- Affichage ----------

const render = (list, { animateRemoval } = {}) => {
  document.querySelectorAll(SELECTORS.button).forEach((btn) => {
    const active = has(list, keyOf(btn))
    btn.classList.toggle('is-active', active)
    btn.setAttribute('aria-pressed', String(active))
  })

  document.querySelectorAll(SELECTORS.nav).forEach((el) => el.classList.toggle('is-active', list.length > 0))
  // N'écrit que si ça change : sinon le MutationObserver se redéclencherait en boucle
  const countText = String(list.length || '')
  document.querySelectorAll(SELECTORS.count).forEach((el) => {
    if (el.textContent !== countText) el.textContent = countText
  })
  document.querySelectorAll(SELECTORS.field).forEach((input) => {
    input.value = list.map((p) => p.name || p.id).join(', ')
  })

  renderWishlistPage(list, animateRemoval)
}

const renderWishlistPage = (list, animateRemoval) => {
  const items = document.querySelectorAll(SELECTORS.item)
  if (!items.length) return

  items.forEach((item) => {
    // Ne coupe pas une animation de retrait en cours
    if (typeof gsap !== 'undefined' && gsap.isTweening(item)) return
    const wished = has(list, keyOf(item))
    const wasWished = item.classList.contains('is-wishlisted')
    item.classList.toggle('is-wishlisted', wished)

    if (wished) {
      item.style.display = ''
    } else if (wasWished && animateRemoval && typeof gsap !== 'undefined') {
      gsap.to(item, {
        opacity: 0,
        scale: 0.96,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          item.style.display = 'none'
          gsap.set(item, { clearProps: 'opacity,transform' })
          updateSections()
        },
      })
    } else {
      item.style.display = 'none'
    }
  })

  updateSections()
}

// Masque un bloc sans produit, affiche l'état vide si la wishlist est vide
// Ignore les attributs section / empty posés par erreur sur une carte produit
const blocks = (selector) => [...document.querySelectorAll(selector)].filter((el) => !el.matches(SELECTORS.item))

// Bloc à masquer quand il n'a aucun article : [data-wishlist-section] s'il existe,
// sinon le bloc .waitlist_component (titre + liste + bouton « Voir tout »)
const sections = () => {
  const explicit = blocks(SELECTORS.section)
  if (explicit.length) return explicit
  const lists = new Set([...document.querySelectorAll(SELECTORS.item)].map((item) => item.closest('.w-dyn-list')))
  return [...lists].filter(Boolean).map((list) => list.closest('.waitlist_component') || list.parentElement)
}

const updateSections = () => {
  sections().forEach((section) => {
    const count = section.querySelectorAll(`${SELECTORS.item}.is-wishlisted`).length
    section.style.display = count ? '' : 'none'
  })

  const countOf = (type) =>
    document.querySelectorAll(`${SELECTORS.item}.is-wishlisted[data-wishlist-type="${type}"]`).length
  const robes = countOf('robe')
  const accessoires = countOf('accessoire')
  const total = robes + accessoires

  // data-wishlist-empty = état vide à afficher (vide = all)
  // all : rien du tout · only-robes : aucune robe (mais des accessoires) · only-accessoires : aucun accessoire (mais des robes)
  const visibleWhen = {
    all: total === 0,
    'only-robes': robes === 0 && accessoires > 0,
    'only-accessoires': accessoires === 0 && robes > 0,
  }
  blocks(SELECTORS.empty).forEach((el) => {
    const state = visibleWhen[el.dataset.wishlistEmpty] ?? visibleWhen.all
    el.style.display = state ? '' : 'none'
  })
}

const pop = (el) => {
  if (typeof gsap === 'undefined') return
  gsap.fromTo(el, { scale: 0.8 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', clearProps: 'transform' })
}

// ---------- Init ----------

export function init() {
  render(read())
  const toasts = createWishlistToasts()

  // Délégation : fonctionne aussi pour les cartes ajoutées plus tard par Finsweet
  document.addEventListener('click', (e) => {
    let btn = e.target.closest(SELECTORS.button)
    if (!btn) return
    // Boutons imbriqués (wrapper + embed) : on agit sur le plus externe
    while (btn.parentElement?.closest(SELECTORS.button)) btn = btn.parentElement.closest(SELECTORS.button)
    e.preventDefault()
    e.stopPropagation() // le cœur est souvent dans une carte-lien : on ne navigue pas
    const list = toggle(btn)
    render(list, { animateRemoval: true })
    pop(btn)
    toasts.show(has(list, keyOf(btn)) ? 'add' : 'remove')
  })

  // Finsweet (filtres, pagination) réinsère des cartes : on réapplique les états
  let scheduled = false
  new MutationObserver(() => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      render(read())
    })
  }).observe(document.body, { childList: true, subtree: true })

  // Wishlist modifiée dans un autre onglet
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) render(read())
  })
}
