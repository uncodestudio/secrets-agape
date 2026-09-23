// Les Secrets d'Agapë — entry point
import { init as initBlogSlider } from './modules/blogSlider.js'
import { init as initTextOpacityAnimation } from './modules/textOpacityAnimation.js'
import { init as initParallaxImage } from './modules/parallaxImage.js'
import { init as initSlideIn } from './modules/slideIn.js'
import { init as initNavbarBgSwitch } from './modules/navbarBgSwitch.js'
import { init as initLogoMarquee } from './modules/logoMarquee.js'

const moduleDetectors = {
  blogSlider: { selector: '.blog_slider', initFn: initBlogSlider },
  textOpacityAnimation: { selector: '.text-opacity-animation', initFn: initTextOpacityAnimation },
  parallaxImage: { selector: '.home-showroom_image', initFn: initParallaxImage },
  slideIn: { selector: '[data-slide-in]', initFn: initSlideIn },
  navbarBgSwitch: { selector: '.navbar_component', initFn: initNavbarBgSwitch },
  logoMarquee: { selector: '.logo_component', initFn: initLogoMarquee },
}

Object.entries(moduleDetectors).forEach(([name, { selector, initFn }]) => {
  if (!document.querySelector(selector)) return
  try {
    initFn()
  } catch (e) {
    console.error(`[${name}]`, e)
  }
})
