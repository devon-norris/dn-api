import permissionDbService from '../db/scripts/permissionDbService'
import dbConfig from '../db/config'
import { Permission } from '../db/models/permissions'
import db from '../db'
const allEnvironments = Object.values(dbConfig.environments)

const create = async (permission: Permission): Promise<any> => {
  try {
    const envResponses: any[] = []
    for await (const env of allEnvironments) {
      const permissionAdded = await permissionDbService.add(env, permission)
      envResponses.push({ env, permission: permissionAdded })
    }

    // Connect back to dev db
    await db()
    return envResponses
  } catch (err) {
    await db()
    throw err
  }
}

const update = async (permission: Permission, id: string): Promise<any> => {
  try {
    const envResponses: any[] = []
    for await (const env of allEnvironments) {
      const permissionModified = await permissionDbService.modify(env, permission, id)
      envResponses.push({ env, permission: permissionModified })
    }

    // Connect back to dev db
    await db()
    return envResponses
  } catch (err) {
    await db()
    throw err
  }
}

const deletePermission = async (id: string): Promise<any> => {
  try {
    const envResponses: any[] = []
    for await (const env of allEnvironments) {
      const permissionDeleted = await permissionDbService.deletePerm(env, id)
      envResponses.push({ env, permission: permissionDeleted })
    }

    // Connect back to dev db
    await db()
    return envResponses
  } catch (err) {
    await db()
    throw err
  }
}

export default { create, update, deletePermission }
