import express from 'express'
import buildTableController from '../util/buildTableController'
import { Router, Request, Response } from '../types'
import config from '../config'
import permissionService from '../services/permissions'
import { sendSuccess, sendError } from '../util/responses'
const router: Router = express.Router()

buildTableController({
  router,
  model: 'permissions',
  get: true,
})

if (config.isDevelopment) {
  router.post('/', async (req: Request, res: Response) => {
    try {
      const data = await permissionService.create(req.body)
      return sendSuccess({ res, message: 'Successfully created permission in all environments!', data })
    } catch (err) {
      return sendError({
        res,
        message: `Failed to create permission in one or more environments - ${err.toString()}`,
        error: err,
      })
    }
  })

  router.put('/', async (req: Request, res: Response) => {
    try {
      const data = await permissionService.update(req.body)
      return sendSuccess({ res, message: 'Successfully updated permission in all environments!', data })
    } catch (err) {
      return sendError({
        res,
        message: `Failed to update permission in one or more environments - ${err.toString()}`,
        error: err,
      })
    }
  })

  router.delete('/', async (req: Request, res: Response) => {
    try {
      const data = await permissionService.deletePermission(req.query.name)
      return sendSuccess({ res, message: 'Successfully deleted permission in all environments!', data })
    } catch (err) {
      return sendError({
        res,
        message: `Failed to delete permission in one or more environments - ${err.toString()}`,
        error: err,
      })
    }
  })
}

export default router
