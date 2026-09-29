const COPIED_LABEL = 'Lien copié !'
const FEEDBACK_DURATION = 2000

const getUrl = () => document.querySelector('link[rel="canonical"]')?.href || window.location.href
const getTitle = () => document.querySelector('h1')?.textContent.trim() || document.title
// Message pré-rempli quand le réseau l'accepte (X, partage natif) — Facebook et LinkedIn l'ignorent
const getMessage = () => `À lire sur Les Secrets d'Agapë : « ${getTitle()} » ✨`

// Liens de partage des réseaux qui en proposent un (Instagram n'en a pas)
const SHARE_URLS = {
  x: (url, message) => `https://x.com/intent/post?url=${url}&text=${message}`,
  facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  linkedin: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
}

// navigator.clipboard n'existe qu'en HTTPS : repli sur l'ancienne méthode sinon
const copy = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const area = Object.assign(document.createElement('textarea'), { value: text })
  area.style.cssText = 'position:fixed;opacity:0'
  document.body.appendChild(area)
  area.select()
  document.execCommand('copy')
  area.remove()
}

// Copie le lien et affiche « Lien copié ! » pendant 2 s sur le bouton
const copyWithFeedback = async (button) => {
  try {
    await copy(getUrl())
  } catch {
    return
  }

  // Texte à remplacer : [data-copy-url-label] s'il existe, sinon le bouton lui-même
  const label = button.querySelector('[data-copy-url-label]') || button
  if (!button._copyTimer) button._copyLabel = label.textContent
  clearTimeout(button._copyTimer)
  label.textContent = COPIED_LABEL

  button._copyTimer = setTimeout(() => {
    label.textContent = button._copyLabel
    button._copyTimer = null
  }, FEEDBACK_DURATION)
}

// Instagram ne permet pas de partager un lien depuis le web :
// menu de partage natif sur mobile (Instagram y figure), sinon copie du lien
const shareInstagram = async (button) => {
  if (navigator.share) {
    try {
      await navigator.share({ title: getTitle(), text: getMessage(), url: getUrl() })
    } catch {
      // Menu fermé sans partager
    }
    return
  }
  copyWithFeedback(button)
}

export function init() {
  document.addEventListener('click', (e) => {
    const copyButton = e.target.closest('[data-copy-url]')
    if (copyButton) {
      e.preventDefault()
      copyWithFeedback(copyButton)
      return
    }

    const socialButton = e.target.closest('[data-share-social]')
    if (!socialButton) return
    e.preventDefault()

    const network = socialButton.dataset.shareSocial
    if (network === 'instagram') {
      shareInstagram(socialButton)
      return
    }

    const buildUrl = SHARE_URLS[network]
    if (!buildUrl) return
    const shareUrl = buildUrl(encodeURIComponent(getUrl()), encodeURIComponent(getMessage()))
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=640')
  })
}
