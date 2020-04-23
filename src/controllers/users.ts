import express from 'express'
import buildCrudController from '../util/buildCrudController'
import { createUsersValidator, modifyUsersValidator, authenticateUser, generateLongLivedToken } from '../services/users'
import { sendError, sendSuccess } from '../util/responses'
import cookieConfig, { REFRESH_TOKEN, ACCESS_TOKEN } from '../util/cookieConfig'
import encryptPassword from '../util/password/encryptPassword'
import { Request, Response, Router } from '../types'
const router: Router = express.Router()

const userBodyOmit = ['googleSignup']
const userResponseOmit = ['password', '__v']

buildCrudController({
  router,
  model: 'users',
  get: {
    responseOmit: userResponseOmit,
  },
  post: {
    validate: createUsersValidator,
    bodyOmit: userBodyOmit,
    responseOmit: userResponseOmit,
    bodyTransform: async (body: any): Promise<any> => {
      const hash = await encryptPassword(body.password)
      return { ...body, password: hash }
    },
  },
  put: {
    validate: modifyUsersValidator,
    bodyOmit: userBodyOmit,
    responseOmit: userResponseOmit,
    bodyTransform: (body: any): any => (body.password ? { ...body, password: encryptPassword(body.password) } : body),
  },
  del: {
    validate: modifyUsersValidator,
    responseOmit: userResponseOmit,
  },
})

router.post(
  '/authenticate',
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken, accessToken, data } = await authenticateUser(req.body)
      res.cookie(ACCESS_TOKEN, accessToken, cookieConfig)
      res.cookie(REFRESH_TOKEN, refreshToken, cookieConfig)
      return sendSuccess({ res, data })
    } catch (err) {
      return sendError({ res, status: 401, error: err })
    }
  }
)

router.get('/authenticate', (req: Request, res: Response): Response => sendSuccess({ res, data: req.user }))

router.post(
  '/logout',
  (req: Request, res: Response): Response => {
    res.clearCookie(ACCESS_TOKEN, cookieConfig)
    res.clearCookie(REFRESH_TOKEN, cookieConfig)
    return sendSuccess({ res, status: 204, data: {} })
  }
)

router.post(
  '/longLivedToken',
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await generateLongLivedToken(req)
      return sendSuccess({ res, data })
    } catch (err) {
      return sendError({ res, error: err })
    }
  }
)

export default router
