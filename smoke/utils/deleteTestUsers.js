const api = require('../api')
const getTestUsers = require('./getTestUsers')
const getOrgId = require('./getOrgId')
const _filter = require('lodash/filter')
const _get = require('lodash/get')
const config = require('../config')
const { token } = config.testSuperAdmin

const deleteSingleTestUser = async id => api({ url: `/users/${id}`, method: 'delete', token })

const deleteTestUsers = async ({ testUsersToDelete, findOne }) => {
  const responses = []

  for await (const testUser of testUsersToDelete) {
    const res = await deleteSingleTestUser(testUser._id)
    responses.push(res)
  }

  return findOne ? responses[0] : responses
}

module.exports = async options => {
  const email = _get(options, 'email')
  const orgEmail = _get(options, 'orgEmail')
  const currentUsers = await getTestUsers()
  let testUsersToDelete = currentUsers
  const findOne = !!email

  if (email) testUsersToDelete = _filter(currentUsers, { email })
  if (orgEmail) {
    const orgId = await getOrgId(orgEmail)
    if (!orgId) return findOne ? undefined : []
    testUsersToDelete = _filter(currentUsers, { orgId })
  }

  return deleteTestUsers({ testUsersToDelete, findOne })
}
