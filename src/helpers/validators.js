// helpers/validators.js

export const isValidEmail    = (email) => /\S+@\S+\.\S+/.test(email)
export const isRequired      = (value) => value !== null && value !== undefined && String(value).trim() !== ''
export const minLength       = (value, min) => String(value).length >= min
export const isPositiveNumber = (value) => !isNaN(value) && Number(value) > 0

export const validateLogin = ({ email, password }) => {
  const errors = {}
  if (!isRequired(email))        errors.email    = 'El correo es obligatorio'
  else if (!isValidEmail(email)) errors.email    = 'Ingresa un correo válido'
  if (!isRequired(password))     errors.password = 'La contraseña es obligatoria'
  return errors
}

export const validateRegister = ({ name, email, password, confirm }) => {
  const errors = {}
  if (!isRequired(name))            errors.name     = 'El nombre es obligatorio'
  if (!isRequired(email))           errors.email    = 'El correo es obligatorio'
  else if (!isValidEmail(email))    errors.email    = 'Ingresa un correo válido'
  if (!isRequired(password))        errors.password = 'La contraseña es obligatoria'
  else if (!minLength(password, 6)) errors.password = 'Mínimo 6 caracteres'
  if (!isRequired(confirm))         errors.confirm  = 'Confirma tu contraseña'
  else if (confirm !== password)    errors.confirm  = 'Las contraseñas no coinciden'
  return errors
}

export const validateProduct = ({ name, description, price, stock }) => {
  const errors = {}
  if (!isRequired(name))        errors.name        = 'El nombre es obligatorio'
  if (!isRequired(description)) errors.description = 'La descripción es obligatoria'
  if (!isPositiveNumber(price)) errors.price       = 'Ingresa un precio válido'
  if (stock !== '' && (isNaN(stock) || Number(stock) < 0))
                                 errors.stock       = 'El stock debe ser un número positivo'
  return errors
}
