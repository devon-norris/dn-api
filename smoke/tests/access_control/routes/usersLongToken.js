const api = require('../../../api')
const expect = require('../../../utils/expect')
const printRoute = require('./printRoute')

module.exports = async ({ user = {}, description }) => {
  const { token = '', role } = user
  const errors = []
  const baseUrl = '/users/longLivedToken'
  const params = { url: `${baseUrl}`, method: 'get', token }
  const expectedPostStatus = token ? (role === 'superadmin' ? 200 : 403) : 401
  const notFoundStatus = token ? 404 : 401

  const getRes = await api({ ...params })
  expect({ res: getRes, expectedStatus: notFoundStatus, description: `GET ${baseUrl} - ${description}`, errors })

  const getIdRes = await api({ ...params, url: `${baseUrl}/123` })
  expect({ res: getIdRes, expectedStatus: notFoundStatus, description: `GET ID ${baseUrl} - ${description}`, errors })

  const postRes = await api({ ...params, method: 'post' })
  expect({ res: postRes, expectedStatus: expectedPostStatus, description: `POST ${baseUrl} - ${description}`, errors })

  const putRes = await api({ ...params, url: `${baseUrl}/123`, method: 'put' })
  expect({ res: putRes, expectedStatus: notFoundStatus, description: `PUT ${baseUrl} - ${description}`, errors })

  const deleteRes = await api({ ...params, url: `${baseUrl}/123`, method: 'delete' })
  expect({ res: deleteRes, expectedStatus: notFoundStatus, description: `DELETE ${baseUrl} - ${description}`, errors })

  printRoute({ errors, msg: baseUrl })
  return errors
}
