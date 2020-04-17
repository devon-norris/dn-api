// UNCOMMENT BELOW TO RECREATE USER OBJECTS
// const { testOrg1, testOrg2 } = require('./testOrganizations')
// const config = require('./')
// const _omit = require('lodash/omit')

// const createUser = ({ name, testOrg, role }) => {
//   const { email, password } = config.user
//   const nameArr = name.split('_')
//   return {
//     fName: nameArr[0],
//     lName: nameArr[1],
//     email: `${name}@${email}`,
//     password,
//     role,
//     orgEmail: testOrg.email,
//   }
// }

// const createTestUserSet = testOrg => {
//   const testUsers = {}
//   const rolesToCreate = Object.values(_omit(config.roles, config.roles.superadmin))
//   rolesToCreate.forEach(role => {
//     const name1 = `${testOrg.name}_${role}1`
//     const name2 = `${testOrg.name}_${role}2`
//     testUsers[name1] = createUser({ name: name1, testOrg, role })
//     testUsers[name2] = createUser({ name: name2, testOrg, role })
//   })
//   return testUsers
// }

// console.log(createTestUserSet(testOrg2))

const testUsers1 = {
  smoketestorg1_user1: {
    fName: 'smoketestorg1',
    lName: 'user1',
    email: 'smoketestorg1_user1@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'user',
    orgEmail: 'smoketestorg1@smoketestorg.com',
  },
  smoketestorg1_user2: {
    fName: 'smoketestorg1',
    lName: 'user2',
    email: 'smoketestorg1_user2@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'user',
    orgEmail: 'smoketestorg1@smoketestorg.com',
  },
  smoketestorg1_admin1: {
    fName: 'smoketestorg1',
    lName: 'admin1',
    email: 'smoketestorg1_admin1@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'admin',
    orgEmail: 'smoketestorg1@smoketestorg.com',
  },
  smoketestorg1_admin2: {
    fName: 'smoketestorg1',
    lName: 'admin2',
    email: 'smoketestorg1_admin2@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'admin',
    orgEmail: 'smoketestorg1@smoketestorg.com',
  },
  smoketestorg1_orgadmin1: {
    fName: 'smoketestorg1',
    lName: 'orgadmin1',
    email: 'smoketestorg1_orgadmin1@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'orgadmin',
    orgEmail: 'smoketestorg1@smoketestorg.com',
  },
  smoketestorg1_orgadmin2: {
    fName: 'smoketestorg1',
    lName: 'orgadmin2',
    email: 'smoketestorg1_orgadmin2@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'orgadmin',
    orgEmail: 'smoketestorg1@smoketestorg.com',
  },
}

const testUsers2 = {
  smoketestorg2_user1: {
    fName: 'smoketestorg2',
    lName: 'user1',
    email: 'smoketestorg2_user1@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'user',
    orgEmail: 'smoketestorg2@smoketestorg.com',
  },
  smoketestorg2_user2: {
    fName: 'smoketestorg2',
    lName: 'user2',
    email: 'smoketestorg2_user2@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'user',
    orgEmail: 'smoketestorg2@smoketestorg.com',
  },
  smoketestorg2_admin1: {
    fName: 'smoketestorg2',
    lName: 'admin1',
    email: 'smoketestorg2_admin1@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'admin',
    orgEmail: 'smoketestorg2@smoketestorg.com',
  },
  smoketestorg2_admin2: {
    fName: 'smoketestorg2',
    lName: 'admin2',
    email: 'smoketestorg2_admin2@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'admin',
    orgEmail: 'smoketestorg2@smoketestorg.com',
  },
  smoketestorg2_orgadmin1: {
    fName: 'smoketestorg2',
    lName: 'orgadmin1',
    email: 'smoketestorg2_orgadmin1@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'orgadmin',
    orgEmail: 'smoketestorg2@smoketestorg.com',
  },
  smoketestorg2_orgadmin2: {
    fName: 'smoketestorg2',
    lName: 'orgadmin2',
    email: 'smoketestorg2_orgadmin2@smoketestuser.com',
    password: 'aVal1dP@ssword',
    role: 'orgadmin',
    orgEmail: 'smoketestorg2@smoketestorg.com',
  },
}

module.exports = { testUsers1, testUsers2 }
