import config from '../config'
import express from 'express'
const { secure, sameSite } = config.cookie

const cookieConfig: express.CookieOptions = {
  httpOnly: true,
  secure,
  signed: true,
}

if (sameSite) cookieConfig.sameSite = 'none'

export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'

export default cookieConfig
