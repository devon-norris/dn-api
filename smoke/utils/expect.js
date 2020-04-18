module.exports = ({ res, expectedStatus, description, errors }) => {
  const { message, status } = res
  if (status !== expectedStatus) {
    errors.push({
      status,
      expectedStatus,
      expected: description,
      apiMessage: message,
    })
  }
}
