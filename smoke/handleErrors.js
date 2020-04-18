const _isEmpty = require('lodash/isEmpty')

module.exports = errors => {
  console.log('---------------------------------------')
  if (!_isEmpty(errors)) {
    console.log('SMOKE TEST ERRORS:', errors)
    throw new Error('SMOKE TESTS FAILED 😭')
  }
  console.log('All tests passed! 🎉')
}
