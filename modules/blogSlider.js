export function init() {
  if (typeof Splide === 'undefined') return

  const el = document.querySelector('.blog_slider')
  if (!el) return

  new Splide(el, {
    type: 'slide',
    perMove: 1,
    focus: 0,
    gap: '2rem',
    autoplay: false,
    arrows: true,
    pagination: false,
    drag: true,
    dragAngleThreshold: 30,
    flickMaxPages: 1,
    flickPower: 50,
    breakpoints: {
      991: {
        perPage: 1.5,
        gap: '1rem',
        padding: { right: '1.5rem' },
      },
      767: {
        perPage: 1.1,
        gap: '0.75rem',
        padding: { right: '1rem' },
      },
    },
  }).mount()
}
