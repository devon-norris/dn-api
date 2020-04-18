const _isEmpty = require('lodash/isEmpty')

module.exports = ({ errors, msg }) => {
  if (_isEmpty(errors)) console.log('✅ ', msg)
  else console.log('❌ ', msg)
}
