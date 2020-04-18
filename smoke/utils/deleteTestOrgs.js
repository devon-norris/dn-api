const api = require('../api')
const getTestOrgs = require('./getTestOrgs')
const _filter = require('lodash/filter')
const config = require('../config')
const { token } = config.testSuperAdmin

const deleteSingleOrg = async id => api({ url: `/organizations/${id}`, method: 'delete', token })

const deleteTestOrgs = async ({ testOrgsToDelete, findOne }) => {
  const responses = []

  for await (const testOrg of testOrgsToDelete) {
    const res = await deleteSingleOrg(testOrg._id)
    responses.push(res)
  }

  return findOne ? responses[0] : responses
}

module.exports = async email => {
  const currentTestOrgs = await getTestOrgs()
  let testOrgsToDelete = currentTestOrgs
  const findOne = !!email

  if (email) testOrgsToDelete = _filter(currentTestOrgs, { email })

  return deleteTestOrgs({ testOrgsToDelete, findOne })
}
