import express from 'express'
import { AccessTokenPayload } from '../util/token/generateToken'

export interface Request extends express.Request {
  user?: AccessTokenPayload
}
// eslint-disable-next-line
export interface Response extends express.Response {}
// eslint-disable-next-line
export interface Router extends express.Router {}
// eslint-disable-next-line
export interface NextFunction extends express.NextFunction {}
