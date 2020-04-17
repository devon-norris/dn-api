const config = require('./')

const testOrg1Name = `${config.org.name}1`
const testOrg2Name = `${config.org.name}2`

const testOrg1 = {
  name: testOrg1Name,
  contactName: 'tester person1',
  country: 'US',
  state: 'GA',
  city: 'Atlanta',
  email: `${testOrg1Name}@${config.org.email}`,
  phone: '12345679898',
}

const testOrg2 = {
  name: testOrg2Name,
  contactName: 'tester person2',
  country: 'US',
  state: 'AL',
  city: 'Mobile',
  email: `${testOrg2Name}@${config.org.email}`,
  phone: '12223334444',
}

module.exports = { testOrg1, testOrg2 }
