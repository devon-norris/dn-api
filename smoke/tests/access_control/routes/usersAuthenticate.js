const api = require('../../../api')
const expect = require('../../../utils/expect')
const printRoute = require('./printRoute')

module.exports = async ({ user = {}, description }) => {
  const { token = '', email, password } = user
  const errors = []
  const baseUrl = '/users/authenticate'
  const params = { url: `${baseUrl}`, method: 'get', token }
  const notFoundStatus = token ? 404 : 401

  const getRes = await api({ ...params })
  expect({ res: getRes, expectedStatus: token ? 200 : 401, description: `GET ${baseUrl} - ${description}`, errors })

  const getIdRes = await api({ ...params, url: `${baseUrl}/123` })
  expect({ res: getIdRes, expectedStatus: 401, description: `GET ID ${baseUrl} - ${description}`, errors })

  const postRes = await api({ url: baseUrl, method: 'post', body: { email, password }, token: '' })
  expect({ res: postRes, expectedStatus: 200, description: `POST ${baseUrl} - ${description}`, errors })

  const postBadDataRes = await api({
    url: baseUrl,
    method: 'post',
    body: { email: `bad${email}`, password: `bad${password}` },
    token: '',
  })
  expect({ res: postBadDataRes, expectedStatus: 401, description: `POST ${baseUrl} - ${description}`, errors })

  const putRes = await api({ ...params, url: `${baseUrl}/123`, method: 'put' })
  expect({ res: putRes, expectedStatus: notFoundStatus, description: `PUT ${baseUrl} - ${description}`, errors })

  const deleteRes = await api({ ...params, url: `${baseUrl}/123`, method: 'delete' })
  expect({ res: deleteRes, expectedStatus: notFoundStatus, description: `DELETE ${baseUrl} - ${description}`, errors })

  printRoute({ errors, msg: baseUrl })
  return errors
}
