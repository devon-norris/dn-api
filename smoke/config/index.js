const { TEST_SA_TOKEN } = process.env

module.exports = {
  org: {
    name: 'smoketestorg',
    email: 'smoketestorg.com',
  },
  user: {
    email: 'smoketestuser.com',
    password: 'aVal1dP@ssword',
  },
  roles: {
    user: 'user',
    admin: 'admin',
    orgadmin: 'orgadmin',
    superadmin: 'superadmin',
  },
  testSuperAdmin: {
    token: TEST_SA_TOKEN,
    oneEmail: 'testsuperadmin1@test.com',
    twoEmail: 'testsuperadmin2@test.com',
  },
  secret: 'secret',
}
