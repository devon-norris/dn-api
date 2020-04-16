interface Routes {
  [route: string]: string
}

const user: Routes = {
  users: '/users',
  usersAuthenticate: '/users/authenticate',
  usersLogout: '/users/logout',
  longLivedToken: '/users/longLivedToken',
}

const routes: Routes = {
  health: '/health',
  organizations: '/organizations',
  permissions: '/permissions',
  ...user,
}

export default routes as Routes
