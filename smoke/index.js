require('dotenv').config()
const axios = require('axios')
const _get = require('lodash/get')
const _isArray = require('lodash/isArray')
const _find = require('lodash/find')
const _isEmpty = require('lodash/isEmpty')
const jwt = require('jsonwebtoken')
const { TEST_SA_TOKEN } = process.env

let tests = 0
let globalStatus = 0
const errors = []
let testOrgId = ''
const testSuperAdmin1Email = 'testsuperadmin1@test.com'
const testSuperAdmin2Email = 'testsuperadmin2@test.com'
let testUsers = {
  testuser1: {
    role: 'user',
    n: '1',
    email: 'testuser1@test.com',
  },
  testuser2: {
    role: 'user',
    n: '2',
    email: 'testuser2@test.com',
  },
  testadmin1: {
    role: 'admin',
    n: '1',
    email: 'testadmin1@test.com',
  },
  testadmin2: {
    role: 'admin',
    n: '2',
    email: 'testadmin2@test.com',
  },
  testorgadmin1: {
    role: 'orgadmin',
    n: '1',
    email: 'testorgadmin1@test.com',
  },
  testorgadmin2: {
    role: 'orgadmin',
    n: '2',
    email: 'testorgadmin2@test.com',
  },
}

const printTests = () => {
  const totalErrors = errors.length
  const totalPassed = tests - totalErrors
  console.log('---------------------------------------------')
  console.log('---------------------------------------------')
  if (totalErrors !== 0) {
    console.log('Errors:', errors)
  }
  const msg = totalPassed === tests ? 'All Tests Passed' : 'Passing Tests'
  console.log(`${msg}: ${totalPassed}/${tests}`)
}

const testOrg = {
  name: 'testorg',
  contactName: 'tester person',
  country: 'US',
  state: 'GA',
  city: 'ATL',
  email: 'testorg@test.com',
  phone: '12345679898',
}

const testOrg2 = {
  name: 'testorg2',
  email: 'testorg2@test.com',
}

const expect = (res, expectedStatus, description) => {
  const status = typeof res === 'number' ? res : res.status
  if (status !== expectedStatus) {
    errors.push({
      description,
      status,
      expectedStatus,
    })
  }
  tests++
}

const api = async ({ url, method = 'get', token = '', data = {} }) =>
  axios({
    baseURL: 'http://localhost:5000',
    url,
    method,
    headers: {
      authorization: token,
    },
    data,
  })
    .then(res => {
      const data = _get(res, 'data', {})
      const status = _get(res, 'status', 0)
      console.log('SUCCESS:', data)
      globalStatus = status
      return { status, data: _get(data, 'data', {}) }
    })
    .catch(err => {
      const response = _get(err, 'response', {})
      const status = _get(response, 'status', 0)
      const data = _get(response, 'data', {})
      const message = _get(data, 'message', '')
      const error = _get(data, 'error', '')
      const errStr = err.toString()
      if (errStr.includes('ECONNREFUSED')) {
        console.log(errStr)
        process.exit()
      }
      console.error(`ERROR: ${message} - ${error} - ${errStr}`)
      globalStatus = status
      return { status, data }
    })

const orgExists = async (email = testOrg.email) => {
  const { data } = await api({ url: '/organizations', method: 'get' })
  if (!_isArray(data)) return false
  const findTestOrg = _find(data, { email })
  return _get(findTestOrg, '_id', false)
}

const userExists = async email => {
  const { data } = await api({ url: '/users', method: 'get', token: TEST_SA_TOKEN })
  if (!_isArray(data)) return false
  const findUser = _find(data, { email })
  return _get(findUser, '_id', false)
}

const generateToken = async email => {
  const userId = await userExists(email)
  if (!userId) return false
  return jwt.sign({ userId }, 'secret')
}

const getTestUsers = async () => {
  const res = await api({ url: '/users', method: 'get', token: TEST_SA_TOKEN })
  const allUsers = _get(res, 'data', [])
  if (!_isArray(allUsers)) return []
  return allUsers.filter(user => user.email.includes('@test.com') && user.role !== 'superadmin')
}

const createTestOrg = async () => {
  const testOrgExists = await orgExists()
  const res = await api({ url: '/organizations', method: 'post', token: TEST_SA_TOKEN, data: testOrg })
  testOrgId = testOrgExists ? testOrgExists : res.data._id
  const expectedStatus = testOrgExists ? 500 : 201
  expect(res, expectedStatus, 'create org')
}

const deleteTestOrg = async () => {
  const testOrgExists = await orgExists()
  const testUsers = await getTestUsers()
  const testUsersExist = !_isEmpty(testUsers)
  const orgId = testOrgExists ? testOrgExists : '123'
  const res = await api({ url: `/organizations/${orgId}`, method: 'delete', token: TEST_SA_TOKEN })
  const expectedStatus = testOrgExists ? (testUsersExist ? 403 : 200) : 500
  expect(res, expectedStatus, 'delete org')
}

const deleteTestUsers = async () => {
  const testUsers = await getTestUsers()
  for await (const user of testUsers) {
    const { fName, lName, _id } = user
    const res = await api({ url: `/users/${_id}`, method: 'delete', token: TEST_SA_TOKEN })
    expect(res, 200, `deleted user ${fName + lName}`)
  }
}

const createTestUsers = async () => {
  const orgId = await orgExists()
  if (!orgId) throw new Error('Org does not exist')
  for await (const user of Object.values(testUsers)) {
    const { role, n } = user
    const fName = 'test'
    const lName = role + n
    const name = fName + lName
    const email = `${name}@test.com`
    const testUserExists = await userExists(email)
    const res = await api({
      url: '/users',
      method: 'post',
      token: TEST_SA_TOKEN,
      data: {
        fName,
        lName,
        email,
        password: 'devotoT@17',
        role,
        orgId,
      },
    })
    const expectedStatus = testUserExists ? 500 : 201
    expect(res, expectedStatus, `created user ${name}`)
  }
}

const noTokenAccess = async () => {
  // Health check
  let res = await api({ url: '/health' })
  expect(res, 200, 'health')
  res = await api({ url: '/health', method: 'post' })
  expect(res, 404, 'health post not found')

  // Not a route
  res = await api({ url: '/notaroute' })
  expect(res, 404, 'route not found')
  res = await api({ url: '/' })
  expect(res, 404, 'route not found')

  // Users
  res = await api({ url: '/users', method: 'get' })
  expect(res, 401, 'invalid token')
  res = await api({ url: '/users/123', method: 'put' })
  expect(res, 401, 'invalid token')
  res = await api({ url: '/users/123', method: 'delete' })
  expect(res, 401, 'invalid token')
  res = await api({ url: '/users', method: 'post' })
  expect(res, 422, 'invalid fields user post')

  // User Authentication
  res = await api({
    url: '/users/authenticate',
    method: 'post',
    data: { email: 'imapup@doggy.com', password: 'imapuP@99' },
  })
  expect(res, 200, 'authentication success')
  res = await api({
    url: '/users/authenticate',
    method: 'post',
    data: { email: 'imapup@doggy.com', password: 'imapuP@9' },
  })
  expect(res, 401, 'invalid')
  res = await api({
    url: '/users/authenticate',
    method: 'post',
    data: { email: 'imapup@oggy.com', password: 'imapuP@99' },
  })
  expect(res, 401, 'invalid')
  res = await api({ url: '/users/authenticate', method: 'get' })
  expect(res, 401, 'invalid token')
  res = await api({ url: '/users/authenticate', method: 'put' })
  expect(res, 404, 'auth put not found')

  // User logout
  res = await api({ url: '/users/logout', method: 'post' })
  expect(res, 204, 'logout success')
  res = await api({ url: '/users/logout', method: 'get' })
  expect(res, 404, 'logout get not found')

  // Long lived token
  res = await api({ url: '/users/longLivedToken', method: 'post' })
  expect(res, 401, 'invalid token')
  res = await api({ url: '/users/longLivedToken', method: 'get' })
  expect(res, 404, 'long token get not found')

  // Organizations
  res = await api({ url: '/organizations', method: 'get' })
  expect(res, 200, 'success getting orgs')
  res = await api({ url: '/organizations', method: 'post' })
  expect(res, 401, 'invalid token for orgs')
  res = await api({ url: '/organizations/123', method: 'put' })
  expect(res, 401, 'invalid token for orgs')
  res = await api({ url: '/organizations/123', method: 'delete' })
  expect(res, 401, 'invalid token for orgs')

  // Permissions
  res = await api({ url: '/permissions', method: 'get' })
  expect(res, 401, 'invalid token for permissions')
}

const userAccess = async () => {
  const { testuser1, testuser2, testadmin1, testorgadmin1 } = testUsers
  const token = await generateToken(testuser1.email)
  const testUser1Id = await userExists(testuser1.email)
  const testUser2Id = await userExists(testuser2.email)
  const testAdmin1Id = await userExists(testadmin1.email)
  const testOrgAdmin1Id = await userExists(testorgadmin1.email)
  const testSuperAdmin1Id = await userExists(testSuperAdmin1Email)
  const _testOrgId = await orgExists()
  if (
    !_testOrgId ||
    !token ||
    [token, testUser1Id, testUser2Id, testAdmin1Id, testOrgAdmin1Id, testSuperAdmin1Id].some(id => id === false)
  )
    throw new Error('User does not exist')

  // Users
  let res = await api({ url: '/users', method: 'get', token })
  // Users - GET
  expect(res, 200, 'fetch users success')
  // Users - PUT
  res = await api({ url: `/users/${testUser2Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'user modifying user access denied')
  res = await api({ url: `/users/${testAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'user modifying admin access denied')
  res = await api({ url: `/users/${testOrgAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'user modifying orgadmin access denied')
  res = await api({ url: `/users/${testSuperAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'user modifying superadmin access denied')
  res = await api({ url: `/users/${testUser1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'user modifying own self access success')
  // Users - DELETE
  res = await api({ url: `/users/${testUser2Id}`, method: 'delete', token })
  expect(res, 403, 'user deleting user access denied')
  res = await api({ url: `/users/${testAdmin1Id}`, method: 'delete', token })
  expect(res, 403, 'user deleting admin access denied')
  res = await api({ url: `/users/${testOrgAdmin1Id}`, method: 'delete', token })
  expect(res, 403, 'user deleting orgadmin access denied')
  res = await api({ url: `/users/${testSuperAdmin1Id}`, method: 'delete', token })
  expect(res, 403, 'user deleting superadmin access denied')

  // Organizations
  res = await api({ url: `/organizations/${_testOrgId}`, method: 'put', data: { name: 'testing' }, token })
  expect(res, 403, 'user modifying org access denied')
  res = await api({ url: `/organizations/${_testOrgId}`, method: 'delete', token })
  expect(res, 403, 'user deleting org access denied')
  res = await api({ url: `/organizations`, method: 'post', data: {}, token })
  expect(res, 403, 'user creating org access denied')

  // Users Authenticate
  res = await api({ url: '/users/authenticate', method: 'get', token })
  expect(res, 200, 'success fetching user data')

  // Long lived token
  res = await api({ url: '/users/longLivedToken', method: 'post', token })
  expect(res, 403, 'user getting long lived token access denied')

  // Permissions
  res = await api({ url: '/permissions', method: 'get', token })
  expect(res, 403, 'GET permissions access denied')
}

const adminAccess = async () => {
  await createTestUsers()
  const { testuser1, testadmin1, testadmin2, testorgadmin1 } = testUsers
  const token = await generateToken(testadmin1.email)
  const testUser1Id = await userExists(testuser1.email)
  const testAdmin1Id = await userExists(testadmin1.email)
  const testAdmin2Id = await userExists(testadmin2.email)
  const testOrgAdmin1Id = await userExists(testorgadmin1.email)
  const testSuperAdmin1Id = await userExists(testSuperAdmin1Email)
  const _testOrgId = await orgExists()
  if (
    !_testOrgId ||
    !token ||
    [testUser1Id, testAdmin1Id, testAdmin2Id, testOrgAdmin1Id, testSuperAdmin1Id].some(id => id === false)
  )
    throw new Error('User does not exist')

  // Users
  let res = await api({ url: '/users', method: 'get', token })
  // Users - GET
  expect(res, 200, 'fetch users success')
  // Users - PUT
  res = await api({ url: `/users/${testUser1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'admin modifying user success')
  res = await api({ url: `/users/${testAdmin2Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'admin modifying admin access denied')
  res = await api({ url: `/users/${testOrgAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'admin modifying orgadmin access denied')
  res = await api({ url: `/users/${testSuperAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'admin modifying superadmin access denied')
  res = await api({ url: `/users/${testAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'admin modifying own self access success')
  // Users - DELETE
  res = await api({ url: `/users/${testUser1Id}`, method: 'delete', token })
  expect(res, 200, 'admin deleting user success')
  res = await api({ url: `/users/${testAdmin2Id}`, method: 'delete', token })
  expect(res, 403, 'admin deleting admin access denied')
  res = await api({ url: `/users/${testOrgAdmin1Id}`, method: 'delete', token })
  expect(res, 403, 'admin deleting orgadmin access denied')
  res = await api({ url: `/users/${testSuperAdmin1Id}`, method: 'delete', token })
  expect(res, 403, 'admin deleting superadmin access denied')

  // Organizations
  res = await api({ url: `/organizations/${_testOrgId}`, method: 'put', data: { name: 'testing' }, token })
  expect(res, 403, 'admin modifying org access denied')
  res = await api({ url: `/organizations/${_testOrgId}`, method: 'delete', token })
  expect(res, 403, 'admin deleting org access denied')
  res = await api({ url: `/organizations`, method: 'post', data: {}, token })
  expect(res, 403, 'admin creating org access denied')

  // Users Authenticate
  res = await api({ url: '/users/authenticate', method: 'get', token })
  expect(res, 200, 'success fetching admin user data')

  // Long lived token
  res = await api({ url: '/users/longLivedToken', method: 'post', token })
  expect(res, 403, 'admin getting long lived token access denied')

  // Permissions
  res = await api({ url: '/permissions', method: 'get', token })
  expect(res, 403, 'GET permissions access denied')
}

const orgAdminAccess = async () => {
  await createTestUsers()
  const { testuser1, testadmin1, testorgadmin1, testorgadmin2 } = testUsers
  const token = await generateToken(testorgadmin1.email)
  const testUser1Id = await userExists(testuser1.email)
  const testAdmin1Id = await userExists(testadmin1.email)
  const testOrgAdmin1Id = await userExists(testorgadmin1.email)
  const testOrgAdmin2Id = await userExists(testorgadmin2.email)
  const testSuperAdmin1Id = await userExists(testSuperAdmin1Email)
  const _testOrgId = await orgExists()
  if (
    !_testOrgId ||
    !token ||
    [testUser1Id, testAdmin1Id, testOrgAdmin1Id, testOrgAdmin2Id, testSuperAdmin1Id].some(id => id === false)
  )
    throw new Error('User does not exist')

  // Users
  let res = await api({ url: '/users', method: 'get', token })
  // Users - GET
  expect(res, 200, 'fetch users success')
  // Users - PUT
  res = await api({ url: `/users/${testUser1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'orgadmin modifying user success')
  res = await api({ url: `/users/${testAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'orgadmin modifying admin success')
  res = await api({ url: `/users/${testOrgAdmin2Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'orgadmin modifying orgadmin access denied')
  res = await api({ url: `/users/${testSuperAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'orgadmin modifying superadmin access denied')
  res = await api({ url: `/users/${testOrgAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'orgadmin modifying own self access success')
  // Users - DELETE
  res = await api({ url: `/users/${testUser1Id}`, method: 'delete', token })
  expect(res, 200, 'orgadmin deleting user success')
  res = await api({ url: `/users/${testAdmin1Id}`, method: 'delete', token })
  expect(res, 200, 'orgadmin deleting admin sucess')
  res = await api({ url: `/users/${testOrgAdmin2Id}`, method: 'delete', token })
  expect(res, 403, 'orgadmin deleting orgadmin access denied')
  res = await api({ url: `/users/${testSuperAdmin1Id}`, method: 'delete', token })
  expect(res, 403, 'orgadmin deleting superadmin access denied')

  // Organizations
  res = await api({ url: `/organizations/${_testOrgId}`, method: 'put', data: { name: 'testing' }, token })
  expect(res, 403, 'orgadmin modifying org access denied')
  res = await api({ url: `/organizations/${_testOrgId}`, method: 'delete', token })
  expect(res, 403, 'orgadmin deleting org access denied')
  res = await api({ url: `/organizations`, method: 'post', data: {}, token })
  expect(res, 403, 'orgadmin creating org access denied')

  // Users Authenticate
  res = await api({ url: '/users/authenticate', method: 'get', token })
  expect(res, 200, 'success fetching orgadmin user data')

  // Long lived token
  res = await api({ url: '/users/longLivedToken', method: 'post', token })
  expect(res, 403, 'orgadmin getting long lived token access denied')

  // Permissions
  res = await api({ url: '/permissions', method: 'get', token })
  expect(res, 403, 'GET permissions access denied')
}

const superAdminAccess = async () => {
  await createTestUsers()
  const { testuser1, testadmin1, testorgadmin1 } = testUsers
  const token = await generateToken(testSuperAdmin1Email)
  const testUser1Id = await userExists(testuser1.email)
  const testAdmin1Id = await userExists(testadmin1.email)
  const testOrgAdmin1Id = await userExists(testorgadmin1.email)
  const testSuperAdmin1Id = await userExists(testSuperAdmin1Email)
  const testSuperAdmin2Id = await userExists(testSuperAdmin2Email)
  const _testOrgId = await orgExists()
  if (
    !_testOrgId ||
    !token ||
    [testUser1Id, testAdmin1Id, testOrgAdmin1Id, testSuperAdmin1Id, testSuperAdmin2Id].some(id => id === false)
  )
    throw new Error('User does not exist')

  // Users
  let res = await api({ url: '/users', method: 'get', token })
  // Users - GET
  expect(res, 200, 'fetch users success')
  // Users - PUT
  res = await api({ url: `/users/${testUser1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'superadmin modifying user success')
  res = await api({ url: `/users/${testAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'superadmin modifying admin success')
  res = await api({ url: `/users/${testOrgAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'superadmin modifying orgadmin success')
  res = await api({ url: `/users/${testSuperAdmin2Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 403, 'superadmin modifying superadmin access denied')
  res = await api({ url: `/users/${testSuperAdmin1Id}`, method: 'put', data: { fName: 'testing' }, token })
  expect(res, 200, 'superadmin modifying own self access success')
  // Users - DELETE
  res = await api({ url: `/users/${testUser1Id}`, method: 'delete', token })
  expect(res, 200, 'superadmin deleting user success')
  res = await api({ url: `/users/${testAdmin1Id}`, method: 'delete', token })
  expect(res, 200, 'superadmin deleting admin success')
  res = await api({ url: `/users/${testOrgAdmin1Id}`, method: 'delete', token })
  expect(res, 200, 'superadmin deleting orgadmin success')
  res = await api({ url: `/users/${testSuperAdmin2Id}`, method: 'delete', token })
  expect(res, 403, 'superadmin deleting superadmin access denied')

  // Organizations
  res = await api({ url: `/organizations/${_testOrgId}`, method: 'put', data: { name: 'testing' }, token })
  expect(res, 200, 'superadmin modifying org success')
  res = await api({ url: '/organizations', method: 'post', data: {}, token })
  expect(res, 500, 'superadmin creating org invalid fields')

  // Users Authenticate
  res = await api({ url: '/users/authenticate', method: 'get', token })
  expect(res, 200, 'success fetching superadmin user data')

  // Long lived token
  res = await api({ url: '/users/longLivedToken', method: 'post', token })
  expect(res, 200, 'super getting long lived token success')

  // Permissions
  res = await api({ url: '/permissions', method: 'get', token })
  expect(res, 200, 'GET permissions success')
}

const userModel = async () => {
  await createTestOrg()
  const orgId = await orgExists()
  const url = '/users'
  const method = 'post'
  const token = TEST_SA_TOKEN
  const startingData = {
    fName: 'test',
    lName: 'user5',
    email: 'badtestuser@test.com',
    password: 'devotoT@17',
    role: 'user',
    orgId,
  }

  // Test starting data (SUCCESS)
  let res = await api({ url, method, token, data: startingData })
  expect(res, 201, 'create user success')
  await deleteTestUsers()

  // Test bad email
  let data = { ...startingData, email: 'badtestuser@test.c' }
  res = await api({ url, method, token, data })
  expect(res, 500, 'invalid data')
  await deleteTestUsers()

  // Test bad password
  data = { ...startingData, password: '123@@(abc' }
  res = await api({ url, method, token, data })
  expect(res, 422, 'invalid password')
  await deleteTestUsers()

  // Test bad role
  data = { ...startingData, role: 'use' }
  res = await api({ url, method, token, data })
  expect(res, 422, 'invalid data')
  data.role = 'User'
  res = await api({ url, method, token, data })
  expect(res, 422, 'invalid data')
  data.role = 'ADMIN'
  res = await api({ url, method, token, data })
  expect(res, 422, 'invalid data')
  await deleteTestUsers()

  // Test bad password
  data = { ...startingData, orgId: '123' }
  res = await api({ url, method, token, data })
  expect(res, 500, 'invalid data')
  await deleteTestUsers()
  await deleteTestOrg()
}

const orgModel = async () => {
  await deleteTestOrg()
  const url = '/organizations'
  const method = 'post'
  const token = TEST_SA_TOKEN
  let data = { ...testOrg }

  // Test adding test org (SUCCESS)
  let res = await api({ url, method, token, data })
  expect(res, 201, 'success adding org')

  // Test unique email and name keys
  res = await api({ url, method, token, data })
  expect(res, 500, 'duplicate email or name')
  data.email = testOrg2.email
  res = await api({ url, method, token, data })
  expect(res, 500, 'duplicate name')

  // Success after email and name are unique
  data.name = testOrg2.name
  res = await api({ url, method, token, data })
  expect(res, 201, 'success adding org')
  const orgId2 = await orgExists(testOrg2.email)
  console.log('orgId2:', orgId2)
  res = await api({ url: `/organizations/${orgId2}`, method: 'delete', token })
  expect(res, 200, 'success deleting org')
}

const modelTests = async () => {
  await userModel()
  await orgModel()
}

const accessTests = async () => {
  await noTokenAccess()
  await createTestOrg()
  await createTestUsers()
  await userAccess()
  await adminAccess()
  await orgAdminAccess()
  await superAdminAccess()
  await deleteTestOrg()
  expect(globalStatus, 403, 'delete org with users')
  await deleteTestUsers()
  await deleteTestOrg()
  expect(globalStatus, 200, 'delete org without users')
}

const runTests = async () => {
  await modelTests()
  await accessTests()
  printTests()
}

runTests()
