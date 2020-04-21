import { Response } from '../types'
import { crossOrgError } from '../db/modelSelect'

interface SuccessResponseParams {
  res: Response
  status?: number
  message?: string
  data: any
}

interface ErrorResponseParams {
  res: Response
  status?: number
  message?: string
  error?: string
}

interface SuccessResponseBody {
  status: string
  message: string
  data: any
}

interface ErrorResponseBody {
  status: string
  message: string
  error: string
}

const statusType = {
  SUCCESS: 'success',
  ERROR: 'error',
}

// -------------- CUSTOM --------------

export const accessDenied = (res: Response): Response => {
  const responseBody: ErrorResponseBody = {
    status: statusType.ERROR,
    message: 'You do not have permission for the requested resource',
    error: 'Access denied',
  }
  return res.status(403).send(responseBody)
}

export const notFound = (res: Response): Response => {
  const responseBody: ErrorResponseBody = {
    status: statusType.ERROR,
    message: 'Could not find the requested resource',
    error: 'Not found',
  }
  return res.status(404).send(responseBody)
}

// -------------- GENERIC --------------

export const sendSuccess = ({ res, status = 200, message = '', data = {} }: SuccessResponseParams): Response => {
  const responseBody: SuccessResponseBody = { status: statusType.SUCCESS, message, data }
  return res.status(status).send(responseBody)
}

export const sendError = ({
  res,
  status = 500,
  message = '',
  error = 'Server Error',
}: ErrorResponseParams): Response => {
  if (message.includes(crossOrgError)) return accessDenied(res)
  const responseBody: ErrorResponseBody = { status: statusType.ERROR, message, error }
  return res.status(status).send(responseBody)
}
