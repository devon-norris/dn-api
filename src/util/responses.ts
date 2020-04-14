import { Response } from '../types'

interface ResponseParams {
  res: Response
  status?: number
  message?: string
  data?: any
  error?: string
}

const statusType = {
  SUCCESS: 'success',
  ERROR: 'error',
}

export const sendSuccess = ({ res, status = 200, message = '', data = {} }: ResponseParams): Response =>
  res.status(status).send({ status: statusType.SUCCESS, message, data })

export const sendError = ({ res, status = 500, message = '', error = 'Server Error' }: ResponseParams): Response =>
  res.status(status).send({ status: statusType.ERROR, message, error })

export const accessDenied = (res: Response): Response =>
  sendError({
    res,
    status: 403,
    message: 'You do not have permission for the requested resource',
    error: 'Access denied',
  })

export const notFound = (res: Response): Response =>
  sendError({
    res,
    status: 404,
    message: 'Could not find the requested resource',
    error: 'Not found',
  })
