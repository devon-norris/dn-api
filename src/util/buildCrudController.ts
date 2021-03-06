import modelSelect, { Service } from '../db/modelSelect'
import _isArray from 'lodash/isArray'
import _omit from 'lodash/omit'
import _get from 'lodash/get'
import _isNil from 'lodash/isNil'
import logger from '../util/logger'
import { AccessTokenPayload } from './token/generateToken'
import { sendSuccess, sendError } from '../util/responses'
import { Request, Response, Router, NextFunction } from '../types'
import isMongoId from '../util/isMongoId'
import determineCrossOrgPermission from '../middleware/permissions/determineCrossOrgPermission'

interface MethodOptions {
  validate?: Function
  bodyTransform?: Function
  bodyOmit?: string[]
  responseOmit?: string[]
  responseOmitFunc?: Function
}

interface BuildControllerParams {
  router: Router
  model: string
  get?: boolean | MethodOptions
  post?: boolean | MethodOptions
  put?: boolean | MethodOptions
  del?: boolean | MethodOptions
}

export interface ValidatorResponse {
  isValid: boolean
  message: string
  status: number
}

export interface ValidatorParams {
  id?: string | undefined
  orgId?: string | undefined
  body: any
  user: AccessTokenPayload
  method: string
}

const validator = async (options: boolean | MethodOptions, req: Request): Promise<ValidatorResponse> => {
  if (typeof options === 'boolean')
    return { isValid: options, message: options ? '' : 'Not found', status: options ? 200 : 404 }
  const { validate } = options
  if (validate === undefined) return { isValid: true, message: '', status: 200 }
  const { params, body, query, user, method } = req
  return validate({
    id: params.id,
    orgId: query.orgId,
    body,
    user,
    method,
  })
}

const handleResponseOmit = (data: any, omit: string[]): any => {
  data = JSON.parse(JSON.stringify(data))
  return (data = _isArray(data) ? data.map(obj => _omit(obj, omit)) : _omit(data, omit))
}

const getService = (req: Request, model: string): Service => {
  const orgId = _get(req, 'user.orgId')
  const role = _get(req, 'user.role')
  const hasCrossOrgPermission = determineCrossOrgPermission(role)
  const service = modelSelect({ model, orgId, hasCrossOrgPermission })
  if (!service) throw new Error('Invalid Service')
  return service
}

export default ({ router, model, get, post, put, del }: BuildControllerParams): void => {
  const childLogger = logger.child({ service: model })

  if (get !== undefined) {
    const responseOmit = _get(get, 'responseOmit', [])
    const responseOmitFunc = _get(get, 'responseOmitFunc')

    router.get(
      '/',
      async (req: Request, res: Response): Promise<Response> => {
        const { orgId } = req.query
        try {
          // Validate
          const { isValid, message, status } = await validator(get, req)
          if (!isValid) return sendError({ res, message, status })

          // Handle data
          const service = getService(req, model)
          let data = orgId ? await service.find({ orgId }) : await service.find()
          data = responseOmitFunc ? responseOmitFunc(data, req) : handleResponseOmit(data, responseOmit)
          return sendSuccess({ req, res, data })
        } catch (err) {
          const errString = err.toString()
          childLogger.error(`Error with GET /${model}`, { orgId, error: errString })
          return sendError({ res, message: errString, error: err })
        }
      }
    )

    router.get(
      '/:id',
      async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { id = '' } = req.params
        if (!isMongoId(id)) return next()
        try {
          // Validate
          const { isValid, message, status } = await validator(get, req)
          if (!isValid) return sendError({ res, message, status })

          // Handle data
          const service = getService(req, model)
          let data = await service.findById(id)
          data = responseOmitFunc ? responseOmitFunc(data, req) : handleResponseOmit(data, responseOmit)
          return sendSuccess({ req, res, data })
        } catch (err) {
          const errString = err.toString()
          childLogger.error(`Error with GET /${model}/${id}`, { error: errString })
          return sendError({ res, message: errString, error: err })
        }
      }
    )
  }

  if (post !== undefined) {
    const responseOmit = _get(post, 'responseOmit', [])
    const responseOmitFunc = _get(post, 'responseOmitFunc')
    const bodyOmit = _get(post, 'bodyOmit', [])
    const bodyTransform = _get(post, 'bodyTransform')

    router.post(
      '/',
      async (req: Request, res: Response): Promise<Response> => {
        let { body } = req
        try {
          // Validate
          const { isValid, message, status } = await validator(post, req)
          if (!isValid) return sendError({ res, message, status })

          // Transform body
          if (bodyTransform) body = await bodyTransform(body)
          body = _omit(body, bodyOmit)

          // Handle data
          const service = getService(req, model)
          let data = await service.create(body)
          data = responseOmitFunc ? responseOmitFunc(data, req) : handleResponseOmit(data, responseOmit)
          return sendSuccess({ req, res, data, status: 201 })
        } catch (err) {
          const errString = err.toString()
          childLogger.error(`Error with POST /${model}`, { body, error: errString })
          return sendError({ res, message: errString, error: err })
        }
      }
    )
  }

  if (put !== undefined) {
    const responseOmit = _get(put, 'responseOmit', [])
    const responseOmitFunc = _get(put, 'responseOmitFunc')
    const bodyOmit = _get(put, 'bodyOmit', [])
    const bodyTransform = _get(put, 'bodyTransform')

    router.put(
      '/:id',
      async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        let { body } = req
        const { id } = req.params
        if (!isMongoId(id)) return next()
        try {
          // Validate
          const { isValid, message, status } = await validator(put, req)
          if (!isValid) return sendError({ res, message, status })

          // Transform body
          if (bodyTransform) body = await bodyTransform(body)
          body = _omit(body, bodyOmit)

          // Handle data
          const service = getService(req, model)
          let data = await service.findByIdAndUpdate(id, body)
          if (_isNil(data)) return sendError({ res, message: 'Resource not found', status: 404 })
          data = responseOmitFunc ? responseOmitFunc(data, req) : handleResponseOmit(data, responseOmit)
          return sendSuccess({ req, res, data })
        } catch (err) {
          const errString = err.toString()
          childLogger.error(`Error with PUT /${model}/${id}`, { body, error: errString })
          return sendError({ res, message: errString, error: err })
        }
      }
    )
  }

  if (del !== undefined) {
    const responseOmit = _get(del, 'responseOmit', [])
    const responseOmitFunc = _get(del, 'responseOmitFunc')

    router.delete(
      '/:id',
      async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const { id } = req.params
        if (!isMongoId(id)) return next()
        try {
          // Validate
          const { isValid, message, status } = await validator(del, req)
          if (!isValid) return sendError({ res, message, status })

          // Handle data
          const service = getService(req, model)
          let data = await service.findByIdAndDelete(id)
          if (_isNil(data)) return sendError({ res, message: 'Resource not found', status: 404 })
          data = responseOmitFunc ? responseOmitFunc(data, req) : handleResponseOmit(data, responseOmit)
          return sendSuccess({ req, res, data })
        } catch (err) {
          const errString = err.toString()
          childLogger.error(`Error with DELETE /${model}/${id}`, { error: errString })
          return sendError({ res, message: errString, error: err })
        }
      }
    )
  }
}
