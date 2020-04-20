const api = require('../../../api')
const expect = require('../../../utils/expect')
const printRoute = require('./printRoute')

module.exports = async ({ user = {}, description, id, postBody, putBody }) => {
  const { token = '' } = user
  const errors = []
  const baseUrl = '/organizations'
  const params = { url: `${baseUrl}`, method: 'get', token }
  const expectedStatus = token ? (role === 'superadmin' ? 200 : 403) : 401
  const expectedPostStatus = token ? (role === 'superadmin' ? 201 : 403) : 401

  const getRes = await api({ ...params })
  expect({ res: getRes, expectedStatus: 200, description: `GET ${baseUrl} - ${description}`, errors })

  const getIdRes = await api({ ...params, url: `${baseUrl}/${id}` })
  expect({ res: getIdRes, expectedStatus, description: `GET ID ${baseUrl} - ${description}`, errors })

  const postRes = await api({ ...params, method: 'post', body: postBody })
  expect({ res: postRes, expectedStatus: expectedPostStatus, description: `POST ${baseUrl} - ${description}`, errors })

  const putRes = await api({ ...params, url: `${baseUrl}/${id}`, method: 'put', body: putBody })
  expect({ res: putRes, expectedStatus, description: `PUT ${baseUrl} - ${description}`, errors })

  const deleteRes = await api({ ...params, url: `${baseUrl}/${id}`, method: 'delete' })
  expect({ res: deleteRes, expectedStatus, description: `DELETE ${baseUrl} - ${description}`, errors })

  printRoute({ errors, msg: baseUrl })
  return errors
}
