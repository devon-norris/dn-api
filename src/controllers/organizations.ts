import express from 'express'
import buildTableController from '../util/buildTableController'
import { deleteOrganizationValidator, organizationResponseOmit } from '../services/organizations'
import { Router } from '../types'
const router: Router = express.Router()

buildTableController({
  router,
  model: 'organizations',
  get: {
    responseOmitFunc: organizationResponseOmit,
  },
  post: true,
  put: true,
  del: {
    validate: deleteOrganizationValidator,
  },
})

export default router
