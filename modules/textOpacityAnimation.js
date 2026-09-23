const START_OPACITY = 0.5

export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return

  gsap.registerPlugin(ScrollTrigger)

  document.querySelectorAll('.text-opacity-animation').forEach((el) => {
    const words = splitIntoWords(el)
    if (!words.length) return

    gsap.fromTo(
      words,
      { opacity: START_OPACITY },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 60%',
          scrub: true,
        },
      }
    )
  })
}

function splitIntoWords(container) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  const textNodes = []
  let node
  while ((node = walker.nextNode())) textNodes.push(node)

  const words = []

  textNodes.forEach((textNode) => {
    const frag = document.createDocumentFragment()

    textNode.textContent.split(/(\s+)/).forEach((part) => {
      if (part === '') return

      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part))
        return
      }

      const span = document.createElement('span')
      span.className = 'text-opacity-word'
      span.style.opacity = String(START_OPACITY)
      span.style.willChange = 'opacity'
      span.textContent = part
      frag.appendChild(span)
      words.push(span)
    })

    textNode.parentNode.replaceChild(frag, textNode)
  })

  return words
}
