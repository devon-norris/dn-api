import express from 'express'
import buildCrudController from '../util/buildCrudController'
import { deleteOrganizationValidator, organizationResponseOmit } from '../services/organizations'
import { Router } from '../types'
const router: Router = express.Router()

buildCrudController({
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
