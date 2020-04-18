require('dotenv').config()
const handleErrors = require('./handleErrors')
const mergeErrors = require('./utils/mergeErrors')
const createTestOrgs = require('./tests/createTestOrgs')

const smokeTests = async () => {
  const createTestOrgErrors = await createTestOrgs()

  handleErrors(mergeErrors(createTestOrgErrors))
}

smokeTests()
