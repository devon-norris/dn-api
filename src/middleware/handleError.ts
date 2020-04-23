import { Request, Response, NextFunction } from '../types'
import { sendError } from '../util/responses'

// eslint-disable-next-line
export default (err: any, req: Request, res: Response, next: NextFunction): Response =>
  sendError({
    res,
    error: err,
  })
