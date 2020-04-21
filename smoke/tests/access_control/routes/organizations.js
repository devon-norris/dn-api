const api = require('../../../api')
const expect = require('../../../utils/expect')
const printRoute = require('./printRoute')
const ensureTestOrgsExist = require('../../../utils/ensureTestOrgsExist')
const { testOrg1: configTestOrg1 } = require('../../../config/testOrganizations')

module.exports = async ({ user = {}, description, postBody = {}, putBody = {} }) => {
  const { token = '', role } = user
  const errors = []
  const baseUrl = '/organizations'
  const params = { url: baseUrl, method: 'get', token }
  const expectedStatus = token ? (role === 'superadmin' ? 200 : 403) : 401
  const testOrg1 = await ensureTestOrgsExist(configTestOrg1.email)
  const testOrg1Id = testOrg1._id

  const getRes = await api({ ...params })
  expect({ res: getRes, expectedStatus: 200, description: `GET ${baseUrl} - ${description}`, errors })

  const getIdRes = await api({ ...params, url: `${baseUrl}/${testOrg1Id}` })
  expect({ res: getIdRes, expectedStatus: 200, description: `GET ID ${baseUrl} - ${description}`, errors })

  const postRes = await api({ ...params, method: 'post', body: postBody })
  expect({
    res: postRes,
    expectedStatus: token ? (role === 'superadmin' ? 500 : 403) : 401,
    description: `POST ${baseUrl} - ${description}`,
    errors,
  })

  const putRes = await api({ ...params, url: `${baseUrl}/${testOrg1Id}`, method: 'put', body: putBody })
  expect({ res: putRes, expectedStatus, description: `PUT ${baseUrl} - ${description}`, errors })

  const deleteRes = await api({ ...params, url: `${baseUrl}/${testOrg1Id}`, method: 'delete' })
  expect({
    res: deleteRes,
    expectedStatus: token ? 403 : 401,
    description: `DELETE ${baseUrl} - ${description}`,
    errors,
  })

  printRoute({ errors, msg: baseUrl })
  return errors
}
