import express from 'express'
import buildTableController from '../util/buildTableController'
import { Router } from '../types'
const router: Router = express.Router()

buildTableController({
  router,
  model: 'permissions',
  get: true,
})

export default router
