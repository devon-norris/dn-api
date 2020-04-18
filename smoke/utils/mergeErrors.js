module.exports = (...args) => {
  const allErrors = []
  args.forEach(errors => errors.forEach(err => allErrors.push(err)))
  return allErrors
}
