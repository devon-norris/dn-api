const api = require('../../../api')
const expect = require('../../../utils/expect')
const printRoute = require('./printRoute')

module.exports = async ({ user = {}, description }) => {
  const { token = '', role } = user
  const errors = []
  const baseUrl = '/permissions'
  const expectedGetStatus = token ? (role === 'superadmin' ? 200 : 403) : 401
  const expectedStatus = token ? (role === 'superadmin' ? 500 : 403) : 401

  const getRes = await api({ url: baseUrl, method: 'get', token })
  expect({ res: getRes, expectedStatus: expectedGetStatus, description: `GET ${baseUrl} - ${description}`, errors })

  const getIdRes = await api({ url: `${baseUrl}/123`, method: 'get', token })
  expect({
    res: getIdRes,
    expectedStatus,
    description: `GET ID ${baseUrl} - ${description}`,
    errors,
  })

  const postRes = await api({ url: baseUrl, method: 'post', token })
  expect({ res: postRes, expectedStatus, description: `POST ${baseUrl} - ${description}`, errors })

  const putRes = await api({ url: `${baseUrl}/123`, method: 'put', token })
  expect({ res: putRes, expectedStatus, description: `PUT ${baseUrl} - ${description}`, errors })

  const deleteRes = await api({ url: `${baseUrl}/123`, method: 'delete', token })
  expect({ res: deleteRes, expectedStatus, description: `DELETE ${baseUrl} - ${description}`, errors })

  printRoute({ errors, msg: baseUrl })
  return errors
}
