const validateLength = (passwordArray: string[]): boolean => passwordArray.length > 7

const hasNoSpaces = (passwordArray: string[]): boolean => passwordArray.every(char => char !== ' ')

const hasUpperCase = (passwordArray: string[]): boolean => passwordArray.some(char => new RegExp(/^[A-Z]*$/).test(char))

const hasLowerCase = (passwordArray: string[]): boolean => passwordArray.some(char => new RegExp(/^[a-z]*$/).test(char))

const hasSpecialChar = (passwordArray: string[]): boolean =>
  passwordArray.some(char => new RegExp(/^[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/).test(char))

const hasNumber = (passwordArray: string[]): boolean => passwordArray.some(char => new RegExp(/^[0-9]*$/).test(char))

export default (password: string): boolean => {
  const passwordArray = password.split('')
  return (
    validateLength(passwordArray) &&
    hasNoSpaces(passwordArray) &&
    hasUpperCase(passwordArray) &&
    hasLowerCase(passwordArray) &&
    hasSpecialChar(passwordArray) &&
    hasNumber(passwordArray)
  )
}
