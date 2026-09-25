// Les Secrets d'Agapë — entry point
import { init as initBlogSlider } from './modules/blogSlider.js'
import { init as initTextOpacityAnimation } from './modules/textOpacityAnimation.js'
import { init as initParallaxImage } from './modules/parallaxImage.js'
import { init as initSlideIn } from './modules/slideIn.js'
import { init as initNavbarBgSwitch } from './modules/navbarBgSwitch.js'
import { init as initLogoMarquee } from './modules/logoMarquee.js'
import { init as initProductFilterToggle } from './modules/productFilterToggle.js'
import { init as initProductModal } from './modules/productModal.js'
import { init as initProductGallery } from './modules/productGallery.js'
import { init as initProductTabs } from './modules/productTabs.js'
import { init as initProductCardSlider } from './modules/productCardSlider.js'
import { init as initShareButton } from './modules/shareButton.js'
import { init as initFormValidation } from './modules/formValidation.js'
import { init as initWishlist } from './modules/wishlist.js'

const moduleDetectors = {
  blogSlider: { selector: '.blog_slider', initFn: initBlogSlider },
  textOpacityAnimation: { selector: '.text-opacity-animation', initFn: initTextOpacityAnimation },
  parallaxImage: { selector: '.home-showroom_image', initFn: initParallaxImage },
  slideIn: { selector: '[data-slide-in]', initFn: initSlideIn },
  navbarBgSwitch: { selector: '.navbar_component', initFn: initNavbarBgSwitch },
  logoMarquee: { selector: '.logo_component', initFn: initLogoMarquee },
  productFilterToggle: { selector: '.product-filter_content', initFn: initProductFilterToggle },
  productModal: { selector: '.product_modal-wrapper', initFn: initProductModal },
  productGallery: { selector: '.product-gallery_main', initFn: initProductGallery },
  productTabs: { selector: '.product-header_tab-item', initFn: initProductTabs },
  productCardSlider: { selector: '.splide.is-accessoires, .splide.is-robes', initFn: initProductCardSlider },
  shareButton: { selector: '[data-share="true"]', initFn: initShareButton },
  formValidation: { selector: '.form_input[required]', initFn: initFormValidation },
  wishlist: { selector: '[data-wishlist-button], [data-wishlist-item], .wishlist_link', initFn: initWishlist },
}

// DEBUG — à retirer
console.log('[agape] main.js chargé', { gsap: typeof gsap, ScrollTrigger: typeof ScrollTrigger, Splide: typeof Splide })

Object.entries(moduleDetectors).forEach(([name, { selector, initFn }]) => {
  if (!document.querySelector(selector)) {
    console.log(`[agape] ${name} ignoré (aucun ${selector})`)
    return
  }
  try {
    console.log(`[agape] ${name} init`)
    initFn()
  } catch (e) {
    console.error(`[${name}]`, e)
  }
})

// Recharge la page quand on franchit un breakpoint Webflow, pour repartir d'un état propre
;[991, 767, 479].forEach((bp) => {
  window.matchMedia(`(max-width: ${bp}px)`).addEventListener('change', () => location.reload())
})
