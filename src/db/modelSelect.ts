import Users from './models/users'
import Organizations from './models/organizations'
import Permissions from './models/permissions'

export default (model: string): any => {
  switch (model) {
    case 'users':
      return Users
    case 'organizations':
      return Organizations
    case 'permissions':
      return Permissions
    default:
      return null
  }
}
