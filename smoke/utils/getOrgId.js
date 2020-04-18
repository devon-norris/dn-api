const getTestOrgs = require('./getTestOrgs')

module.exports = async orgEmail => {
  const res = await getTestOrgs(orgEmail)
  if (!res) return false
  return res.data._id
}
