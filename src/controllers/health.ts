import { sendSuccess } from '../util/responses'
import { Request, Response } from '../types'

export default (req: Request, res: Response): Response =>
  sendSuccess({
    res,
    message: 'Server is running',
    data: {
      uptime: process.uptime(),
    },
  })
