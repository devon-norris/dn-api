import Users from './models/users'
import Organizations from './models/organizations'

export default (model: string): any => {
  switch (model) {
    case 'users':
      return Users
    case 'organizations':
      return Organizations
    default:
      return null
  }
}
