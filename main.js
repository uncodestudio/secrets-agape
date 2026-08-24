// Les Secrets d'Agapë — entry point
import { init as initBlogSlider } from './modules/blogSlider.js'

const moduleDetectors = {
  blogSlider: { selector: '.blog_slider', initFn: initBlogSlider },
}

Object.entries(moduleDetectors).forEach(([name, { selector, initFn }]) => {
  if (!document.querySelector(selector)) return
  try {
    initFn()
  } catch (e) {
    console.error(`[${name}]`, e)
  }
})
