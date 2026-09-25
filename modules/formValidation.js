const FIELD_SELECTOR = '.form_input[required]'

const getError = (field) =>
  [...field.parentElement.children].find((el) => el !== field && el.classList.contains('form-error'))

const setFieldState = (field, invalid) => {
  field.classList.toggle('is-error', invalid)
  field.setAttribute('aria-invalid', String(invalid))
  const error = getError(field)
  if (error) error.style.display = invalid ? 'block' : 'none'
}

const isInvalid = (field) => field.value.trim() === '' || !field.checkValidity()

export function init() {
  const forms = new Set([...document.querySelectorAll(FIELD_SELECTOR)].map((field) => field.form).filter(Boolean))

  forms.forEach((form) => {
    const fields = form.querySelectorAll(FIELD_SELECTOR)

    // Désactive les bulles natives du navigateur : ce sont les .form-error qui s'affichent
    form.noValidate = true
    fields.forEach((field) => {
      getError(field)?.style.setProperty('display', 'none')
      // Validation en direct dès qu'on commence à remplir le champ, et quand on le quitte
      const validate = () => setFieldState(field, isInvalid(field))
      field.addEventListener('input', validate)
      field.addEventListener('blur', validate)
    })

    // Phase de capture : passe avant le handler d'envoi de Webflow pour pouvoir le bloquer
    form.addEventListener(
      'submit',
      (e) => {
        const invalidFields = [...fields].filter(isInvalid)
        fields.forEach((field) => setFieldState(field, invalidFields.includes(field)))
        if (!invalidFields.length) return

        e.preventDefault()
        e.stopImmediatePropagation()
        invalidFields[0].focus()
      },
      true
    )
  })
}
