const COPIED_LABEL = 'Lien copié'
const FEEDBACK_DURATION = 2000

const getShareData = () => {
  const canonical = document.querySelector('link[rel="canonical"]')?.href
  const title = document.querySelector('h1')?.textContent.trim() || document.title
  return {
    title,
    text: `${title} — Les Secrets d'Agapë`,
    url: canonical || window.location.href,
  }
}

// Repli quand le partage natif n'existe pas (Firefox desktop, etc.) : copie du lien
const copyLink = async (button, url) => {
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    return
  }

  const label = button.textContent
  button.textContent = COPIED_LABEL
  setTimeout(() => (button.textContent = label), FEEDBACK_DURATION)
}

export function init() {
  document.querySelectorAll('[data-share="true"]').forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault()
      const data = getShareData()

      if (navigator.share) {
        try {
          await navigator.share(data)
        } catch (err) {
          // Fermer la feuille de partage n'est pas une erreur
          if (err.name !== 'AbortError') copyLink(button, data.url)
        }
        return
      }

      copyLink(button, data.url)
    })
  })
}
