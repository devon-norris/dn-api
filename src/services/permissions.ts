// TODO: bring in actual actions from permission scripts

interface Permission {
  name: string
  roles: string[]
}

const create = async (permission: Permission): Promise<Permission> => {
  console.log('Mock creating permission:', permission)
  return permission
}

const update = async (id: string, permission: Permission): Promise<Permission> => {
  console.log('Mock updating permission:', id, permission)
  return permission
}

const deletePermission = async (id: string): Promise<any> => {
  console.log('Mock deleting permission:', id)
  return {}
}

export default { create, update, deletePermission }
