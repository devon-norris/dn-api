// Import models
import Users from './models/users'
import Organizations from './models/organizations'
import Permissions from './models/permissions'
// Other imports
import _get from 'lodash/get'

export const crossOrgError = 'Cross organization request not allowed'

interface ModelSelect {
  model: string
  orgId: string
  hasCrossOrgPermission: boolean
}

interface HandleService {
  service: any
  reqOrgId: string
  hasCrossOrgPermission: boolean
}

export interface Service {
  find: Function
  findById: Function
  findByIdAndUpdate: Function
  findByIdAndDelete: Function
  create: Function
}

interface HandleFindById {
  service: any
  reqOrgId: string
  id: string
}

const handleFindById = async ({ service, reqOrgId, id }: HandleFindById): Promise<any> => {
  const data = await service.findById(id)
  const orgId = _get(data, 'orgId')
  if (orgId && orgId !== reqOrgId) throw new Error(crossOrgError)
  return data
}

const handleService = ({ service, reqOrgId, hasCrossOrgPermission }: HandleService): Service => ({
  create: async (data: any): Promise<any> => {
    if (hasCrossOrgPermission) return new service(data).save()
    const orgId = _get(data, 'orgId')
    if (orgId && reqOrgId && orgId !== reqOrgId) throw new Error(crossOrgError)
    return new service(data).save()
  },
  find: async (options: any): Promise<any> => {
    if (!reqOrgId || hasCrossOrgPermission) return options ? service.find(options) : service.find()
    const orgId = _get(options, 'orgId')
    if (orgId && orgId !== reqOrgId) throw new Error(crossOrgError)
    const data = options ? await service.find(options) : await service.find()
    return data.filter(({ orgId }: any) => !orgId || orgId === reqOrgId)
  },
  findById: async (id: string): Promise<any> => {
    if (!reqOrgId || hasCrossOrgPermission) return service.findById(id)
    return handleFindById({ service, reqOrgId, id })
  },
  findByIdAndUpdate: async (id: string, data: any): Promise<any> => {
    if (hasCrossOrgPermission) return service.findByIdAndUpdate(id, data)
    if (!reqOrgId) throw new Error(crossOrgError)
    await handleFindById({ service, reqOrgId, id })
    return service.findByIdAndUpdate(id, data)
  },
  findByIdAndDelete: async (id: string): Promise<any> => {
    if (hasCrossOrgPermission) return service.findByIdAndDelete(id)
    if (!reqOrgId) throw new Error(crossOrgError)
    await handleFindById({ service, reqOrgId, id })
    return service.findByIdAndDelete(id)
  },
})

export default ({ model, orgId, hasCrossOrgPermission }: ModelSelect): any => {
  switch (model) {
    case 'users':
      return handleService({ service: Users, reqOrgId: orgId, hasCrossOrgPermission })
    case 'organizations':
      return handleService({ service: Organizations, reqOrgId: orgId, hasCrossOrgPermission })
    case 'permissions':
      return handleService({ service: Permissions, reqOrgId: orgId, hasCrossOrgPermission })
    default:
      return null
  }
}
