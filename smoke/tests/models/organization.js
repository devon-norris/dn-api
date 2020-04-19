const api = require('../../api')
const { testOrg1, testOrg2 } = require('../../config/testOrganizations')
const printMsg = require('../../utils/printMsg')
const expect = require('../../utils/expect')
const deleteTestOrgs = require('../../utils/deleteTestOrgs')
const config = require('../../config')
const { token } = config.testSuperAdmin

const params = { url: '/organizations', method: 'post', token }

module.exports = async () => {
  const errors = []
  const goodData = { ...testOrg1 }

  // Remove any previous test orgs
  await deleteTestOrgs()

  // Test successful add
  const addTestOrgSuccessRes = await api({ ...params, body: goodData })
  expect({
    res: addTestOrgSuccessRes,
    expectedStatus: 201,
    description: 'Organization Model - add organization success',
    errors,
  })

  // Test unique email and name keys
  const sameNameEmailRes = await api({ ...params, body: goodData })
  expect({
    res: sameNameEmailRes,
    expectedStatus: 500,
    description: 'Organization Model - create error duplicate email or name',
    errors,
  })
  const sameNameRes = await api({ ...params, body: { ...goodData, email: testOrg2.email } })
  expect({
    res: sameNameRes,
    expectedStatus: 500,
    description: 'Organization Model - create error duplicate name',
    errors,
  })
  const sameEmailRes = await api({ ...params, body: { ...goodData, name: testOrg2.name } })
  expect({
    res: sameEmailRes,
    expectedStatus: 500,
    description: 'Organization Model - create error duplicate email',
    errors,
  })
  const uniqueNameAndEmailRes = await api({
    ...params,
    body: { ...goodData, name: testOrg2.name, email: testOrg2.email },
  })
  expect({
    res: uniqueNameAndEmailRes,
    expectedStatus: 201,
    description: 'Organization Model - create same org with unique name and email success',
    errors,
  })

  // Cleanup
  await deleteTestOrgs()

  printMsg({ errors, msg: 'Organization Model' })
  return errors
}
