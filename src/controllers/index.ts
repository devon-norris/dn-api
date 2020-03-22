import express from 'express'
import health from './health'
import users from './users'
import organizations from './organizations'
import routes from '../middleware/permissions/routes'
import { Router } from '../types'
const router: Router = express.Router()

// Health Check
router.get(routes.health, health)

// Routes
router.use(routes.users, users)
router.use(routes.organizations, organizations)

export default router
