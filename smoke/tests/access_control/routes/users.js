const api = require('../../../api')
const expect = require('../../../utils/expect')
const printRoute = require('./printRoute')
const ensureTestOrgsExist = require('../../../utils/ensureTestOrgsExist')
const generateTestUsers = require('../../../utils/generateTestUsers')
const deleteTestUsers = require('../../../utils/deleteTestUsers')
const generateToken = require('../../../utils/generateToken')
const _find = require('lodash/find')
const _omit = require('lodash/omit')
const { testOrg1: configTestOrg1, testOrg2: configTestOrg2 } = require('../../../config/testOrganizations')
const { testUsers1: configTestUsers1, testUsers2: configTestUsers2 } = require('../../../config/testUsers')
const { testSuperAdmin } = require('../../../config')
const { smoketestorg1_user2, smoketestorg1_admin2, smoketestorg1_orgadmin2 } = configTestUsers1

const roleAccess = {
  user: 1,
  admin: 2,
  orgadmin: 3,
  superadmin: 4,
}

const hasPostAccess = (userRole, userToCreate) => {
  const userAccess = roleAccess[userRole] || 1
  const userToCreateAccess = roleAccess[userToCreate.role] || 5
  return userAccess >= userToCreateAccess
}

const hasModifyAccess = (userRole, userToModify) => {
  const userAccess = roleAccess[userRole] || 0
  const userToModifyAccess = roleAccess[userToModify.role] || 5
  return userToModifyAccess < userAccess
}

const hasRoleChangeAccess = (userRole, userToModify, bodyRole) => {
  const userAccess = roleAccess[userRole] || 0
  const userToModifyAccess = roleAccess[userToModify.role] || 5
  const canModifyUser = userToModifyAccess < userAccess
  const bodyRoleAccess = roleAccess[bodyRole] || 5
  return canModifyUser && userAccess >= bodyRoleAccess
}

const deleteTestUserSample = async () => {
  await deleteTestUsers({ email: smoketestorg1_user2.email })
  await deleteTestUsers({ email: smoketestorg1_admin2.email })
  await deleteTestUsers({ email: smoketestorg1_orgadmin2.email })
}

module.exports = async ({ user = {}, description }) => {
  const testOrgs = await ensureTestOrgsExist()
  const testOrg1Id = _find(testOrgs, { email: configTestOrg1.email })._id
  const superadminToModifyId = testSuperAdmin.two.id
  await deleteTestUserSample()

  // POST bodies
  const userToPost = { ..._omit(smoketestorg1_user2, 'orgEmail'), orgId: testOrg1Id }
  const adminToPost = { ..._omit(smoketestorg1_admin2, 'orgEmail'), orgId: testOrg1Id }
  const orgadminToPost = { ..._omit(smoketestorg1_orgadmin2, 'orgEmail'), orgId: testOrg1Id }

  const { token = '', role, id } = user
  const errors = []
  const baseUrl = '/users'

  // GET
  const getRes = await api({ url: baseUrl, method: 'get', token })
  expect({ res: getRes, expectedStatus: token ? 200 : 401, description: `GET ${baseUrl} - ${description}`, errors })

  // GET ID
  const getIdRes = await api({ url: `${baseUrl}/${id}`, method: 'get', token })
  expect({
    res: getIdRes,
    expectedStatus: token ? 200 : 401,
    description: `GET ID ${baseUrl} - ${description}`,
    errors,
  })

  // GET ID (cross org)
  const getIdCrossOrgRes = await api({ url: `${baseUrl}/${testSuperAdmin.two.id}`, method: 'get', token })
  expect({
    res: getIdCrossOrgRes,
    expectedStatus: token ? (role === 'superadmin' ? 200 : 403) : 401,
    description: `GET ID ${baseUrl} - ${description} - cross org`,
    errors,
  })

  // POST - USER
  const postUserRes = await api({ url: baseUrl, method: 'post', token, body: userToPost })
  expect({
    res: postUserRes,
    expectedStatus: hasPostAccess(role, userToPost) ? 201 : 403,
    description: `POST ${baseUrl} - ${description} - create user`,
    errors,
  })
  // POST - ADMIN
  const postAdminRes = await api({ url: baseUrl, method: 'post', token, body: adminToPost })
  expect({
    res: postAdminRes,
    expectedStatus: hasPostAccess(role, adminToPost) ? 201 : 403,
    description: `POST ${baseUrl} - ${description} - create admin`,
    errors,
  })
  // POST - ORG ADMIN
  const postOrgAdminRes = await api({ url: baseUrl, method: 'post', token, body: orgadminToPost })
  expect({
    res: postOrgAdminRes,
    expectedStatus: hasPostAccess(role, orgadminToPost) ? 201 : 403,
    description: `POST ${baseUrl} - ${description} - create org admin`,
    errors,
  })
  if (role !== 'superadmin') {
    // POST - ORG ADMIN
    const postSuperAdminRes = await api({ url: baseUrl, method: 'post', token, body: { role: 'superadmin' } })
    expect({
      res: postSuperAdminRes,
      expectedStatus: hasPostAccess(role, { role: 'superadmin' }) ? 201 : 403,
      description: `POST ${baseUrl} - ${description} - create super admin`,
      errors,
    })
  }

  // Create User Samples
  const testUsers1Res = await generateTestUsers({ orgEmail: configTestOrg1.email })
  const testUsersOrg1 = testUsers1Res.map(({ data }) => data)
  // ID's
  const userToModifyId = _find(testUsersOrg1, { email: smoketestorg1_user2.email })._id
  const adminToModifyId = _find(testUsersOrg1, { email: smoketestorg1_admin2.email })._id
  const orgadminToModifyId = _find(testUsersOrg1, { email: smoketestorg1_orgadmin2.email })._id
  const orgadminToModifyToken = await generateToken({ _id: orgadminToModifyId })

  // PUT - USER
  const putUserRes = await api({
    url: `${baseUrl}/${userToModifyId}`,
    method: 'put',
    token,
    body: { fName: 'billybob' },
  })
  expect({
    res: putUserRes,
    expectedStatus: token ? (hasModifyAccess(role, { role: 'user' }) ? 200 : 403) : 401,
    description: `PUT ${baseUrl} - ${description} - update user`,
    errors,
  })
  // PUT - ADMIN
  const putAdminRes = await api({
    url: `${baseUrl}/${adminToModifyId}`,
    method: 'put',
    token,
    body: { fName: 'billybob' },
  })
  expect({
    res: putAdminRes,
    expectedStatus: token ? (hasModifyAccess(role, { role: 'admin' }) ? 200 : 403) : 401,
    description: `PUT ${baseUrl} - ${description} - update admin`,
    errors,
  })
  // PUT - ORG ADMIN
  const putOrgAdminRes = await api({
    url: `${baseUrl}/${orgadminToModifyId}`,
    method: 'put',
    token,
    body: { fName: 'billybob' },
  })
  expect({
    res: putOrgAdminRes,
    expectedStatus: token ? (hasModifyAccess(role, { role: 'orgadmin' }) ? 200 : 403) : 401,
    description: `PUT ${baseUrl} - ${description} - update orgadmin`,
    errors,
  })
  // PUT - ORG ADMIN (modify self)
  const putOrgAdminSelfRes = await api({
    url: `${baseUrl}/${orgadminToModifyId}`,
    method: 'put',
    token: orgadminToModifyToken,
    body: { fName: 'billybob' },
  })
  expect({
    res: putOrgAdminSelfRes,
    expectedStatus: 200,
    description: `PUT ${baseUrl} - ${description} - update orgadmin (modify self)`,
    errors,
  })
  // PUT - SUPER ADMIN
  const putSuperAdminRes = await api({
    url: `${baseUrl}/${superadminToModifyId}`,
    method: 'put',
    token,
    body: { fName: 'billybob' },
  })
  expect({
    res: putSuperAdminRes,
    expectedStatus: token ? (hasModifyAccess(role, { role: 'superadmin' }) ? 200 : 403) : 401,
    description: `PUT ${baseUrl} - ${description} - update superadmin`,
    errors,
  })

  // DELETE - USER
  const deleteUserRes = await api({
    url: `${baseUrl}/${userToModifyId}`,
    method: 'delete',
    token,
  })
  expect({
    res: deleteUserRes,
    expectedStatus: token ? (hasModifyAccess(role, { role: 'user' }) ? 200 : 403) : 401,
    description: `DELETE ${baseUrl} - ${description} - delete user`,
    errors,
  })
  // DELETE - ADMIN
  const deleteAdminRes = await api({
    url: `${baseUrl}/${adminToModifyId}`,
    method: 'delete',
    token,
  })
  expect({
    res: deleteAdminRes,
    expectedStatus: token ? (hasModifyAccess(role, { role: 'admin' }) ? 200 : 403) : 401,
    description: `DELETE ${baseUrl} - ${description} - delete admin`,
    errors,
  })
  // DELETE - ORG ADMIN
  const deleteOrgAdminRes = await api({
    url: `${baseUrl}/${orgadminToModifyId}`,
    method: 'delete',
    token,
  })
  expect({
    res: deleteOrgAdminRes,
    expectedStatus: token ? (hasModifyAccess(role, { role: 'orgadmin' }) ? 200 : 403) : 401,
    description: `DELETE ${baseUrl} - ${description} - delete orgadmin`,
    errors,
  })
  // DELETE - SUPER ADMIN
  const deleteSuperAdminRes = await api({
    url: `${baseUrl}/${superadminToModifyId}`,
    method: 'delete',
    token,
  })
  expect({
    res: deleteSuperAdminRes,
    expectedStatus: token ? (hasModifyAccess(role, { role: 'superadmin' }) ? 200 : 403) : 401,
    description: `DELETE ${baseUrl} - ${description} - delete superadmin`,
    errors,
  })

  // ROLE CHANGE UP TEST
  // Create User Samples Again
  await deleteTestUserSample()
  const testUsers1Res_2 = await generateTestUsers({ orgEmail: configTestOrg1.email })
  const testUsersOrg1_2 = testUsers1Res_2.map(({ data }) => data)
  // ID's
  const userToModifyId_2 = _find(testUsersOrg1_2, { email: smoketestorg1_user2.email })._id
  const adminToModifyId_2 = _find(testUsersOrg1_2, { email: smoketestorg1_admin2.email })._id
  const orgadminToModifyId_2 = _find(testUsersOrg1_2, { email: smoketestorg1_orgadmin2.email })._id

  // PUT - USER (role up)
  const putUserRoleUpRes = await api({
    url: `${baseUrl}/${userToModifyId_2}`,
    method: 'put',
    token,
    body: { fName: 'billybob', role: 'admin' },
  })
  expect({
    res: putUserRoleUpRes,
    expectedStatus: token ? (hasRoleChangeAccess(role, { role: 'user' }, 'admin') ? 200 : 403) : 401,
    description: `PUT ${baseUrl} - ${description} - update user (role up)`,
    errors,
  })
  // PUT - ADMIN (role up)
  const putAdminRoleUpRes = await api({
    url: `${baseUrl}/${adminToModifyId_2}`,
    method: 'put',
    token,
    body: { fName: 'billybob', role: 'orgadmin' },
  })
  expect({
    res: putAdminRoleUpRes,
    expectedStatus: token ? (hasRoleChangeAccess(role, { role: 'admin' }, 'orgadmin') ? 200 : 403) : 401,
    description: `PUT ${baseUrl} - ${description} - update admin (role up)`,
    errors,
  })
  // PUT - ORG ADMIN (role up)
  const putOrgAdminRoleUpRes = await api({
    url: `${baseUrl}/${orgadminToModifyId_2}`,
    method: 'put',
    token,
    body: { fName: 'billybob', role: 'superadmin' },
  })
  expect({
    res: putOrgAdminRoleUpRes,
    expectedStatus: token ? (hasRoleChangeAccess(role, { role: 'orgadmin' }, 'superadmin') ? 200 : 403) : 401,
    description: `PUT ${baseUrl} - ${description} - update org admin (role up)`,
    errors,
  })

  // ROLE CHANGE DOWN TEST
  // Create User Samples Again
  await deleteTestUserSample()
  const testUsers1Res_3 = await generateTestUsers({ orgEmail: configTestOrg1.email })
  const testUsersOrg1_3 = testUsers1Res_3.map(({ data }) => data)
  // ID's
  const adminToModifyId_3 = _find(testUsersOrg1_3, { email: smoketestorg1_admin2.email })._id
  const orgadminToModifyId_3 = _find(testUsersOrg1_3, { email: smoketestorg1_orgadmin2.email })._id

  // PUT - ADMIN (role down)
  const putAdminRoleDownRes = await api({
    url: `${baseUrl}/${adminToModifyId_3}`,
    method: 'put',
    token,
    body: { fName: 'billybob', role: 'user' },
  })
  expect({
    res: putAdminRoleDownRes,
    expectedStatus: token ? (hasRoleChangeAccess(role, { role: 'admin' }, 'user') ? 200 : 403) : 401,
    description: `PUT ${baseUrl} - ${description} - update admin (role down)`,
    errors,
  })
  // PUT - ORG ADMIN (role down)
  const putOrgAdminRoleDownRes = await api({
    url: `${baseUrl}/${orgadminToModifyId_3}`,
    method: 'put',
    token,
    body: { fName: 'billybob', role: 'admin' },
  })
  expect({
    res: putOrgAdminRoleDownRes,
    expectedStatus: token ? (hasRoleChangeAccess(role, { role: 'orgadmin' }, 'admin') ? 200 : 403) : 401,
    description: `PUT ${baseUrl} - ${description} - update org admin (role down)`,
    errors,
  })

  // FOR FUTURE USE - ADD TO CONFIG IF NEEDED
  const showUserResponses = false
  if (showUserResponses) {
    console.log('getRes', getRes)
    console.log('getIdRes', getIdRes)
    console.log('getIdCrossOrgRes', getIdCrossOrgRes)
    console.log('postUserRes', postUserRes)
    console.log('postAdminRes', postAdminRes)
    console.log('postOrgAdminRes', postOrgAdminRes)
    console.log('postSuperAdminRes', postSuperAdminRes)
    console.log('putUserRes', putUserRes)
    console.log('putAdminRes', putAdminRes)
    console.log('putOrgAdminRes', putOrgAdminRes)
    console.log('putOrgAdminSelfRes', putOrgAdminSelfRes)
    console.log('putSuperAdminRes', putSuperAdminRes)
    console.log('deleteUserRes', deleteUserRes)
    console.log('deleteAdminRes', deleteAdminRes)
    console.log('deleteOrgAdminRes', deleteOrgAdminRes)
    console.log('deleteSuperAdminRes', deleteSuperAdminRes)
    console.log('putUserRoleUpRes', putUserRoleUpRes)
    console.log('putAdminRoleUpRes', putAdminRoleUpRes)
    console.log('putOrgAdminRoleUpRes', putOrgAdminRoleUpRes)
    console.log('putAdminRoleDownRes', putAdminRoleDownRes)
    console.log('putOrgAdminRoleDownRes', putOrgAdminRoleDownRes)
  }

  printRoute({ errors, msg: baseUrl })
  return errors
}
