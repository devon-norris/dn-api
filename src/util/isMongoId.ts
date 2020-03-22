export default (id: string): boolean => {
  const idArr = id.split('')
  return idArr.some(char => new RegExp(/^[0-9]*$/).test(char))
}
