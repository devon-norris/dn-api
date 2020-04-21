const api = require('../../../api')
const expect = require('../../../utils/expect')
const printRoute = require('./printRoute')

module.exports = async ({ user = {}, description }) => {
  const { token = '', role } = user
  const errors = []
  const baseUrl = '/permissions'
  const params = { url: `${baseUrl}`, method: 'get', token }
  const expectedStatus = token ? (role === 'superadmin' ? 200 : 403) : 401

  const getRes = await api({ ...params })
  expect({ res: getRes, expectedStatus, description: `GET ${baseUrl} - ${description}`, errors })

  const getIdRes = await api({ ...params, url: `${baseUrl}/123` })
  expect({
    res: getIdRes,
    expectedStatus,
    description: `GET ID ${baseUrl} - ${description}`,
    errors,
  })

  const postRes = await api({ ...params, method: 'post' })
  expect({ res: postRes, expectedStatus, description: `POST ${baseUrl} - ${description}`, errors })

  const putRes = await api({ ...params, url: `${baseUrl}/123`, method: 'put' })
  expect({ res: putRes, expectedStatus, description: `PUT ${baseUrl} - ${description}`, errors })

  const deleteRes = await api({ ...params, url: `${baseUrl}/123`, method: 'delete' })
  expect({ res: deleteRes, expectedStatus, description: `DELETE ${baseUrl} - ${description}`, errors })

  printRoute({ errors, msg: baseUrl })
  return errors
}
