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
    one: {
      email: 'testsuperadmin1@test.com',
      id: '5e7170583bb94a5bff067451',
      orgId: '5e6c1d2f0cc7f63c95a08be6',
      password: 'devotoT@17',
    },
    two: {
      email: 'testsuperadmin2@test.com',
      id: '5e72a0d14447f34de512c1ef',
      orgId: '5e6c1d2f0cc7f63c95a08be6',
      password: 'devotoT@17',
    },
  },
  secret: 'secret',
}
