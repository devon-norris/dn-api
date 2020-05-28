import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import controllers from './controllers'
import config from './config'
import db from './db'
import { permissions, validateJWT, notFound, handleError } from './middleware'
const server = express()
const { loggingFormat, cookie, origin, port } = config

// Connect to DB
db()

// Initialize Server
server.use(helmet())
server.use(morgan(loggingFormat))
server.use(express.urlencoded({ extended: false }))
server.use(express.json())
server.use(cookieParser(cookie.secret))
server.use(cors({ origin, credentials: true }))

// Validate JWT
server.use(validateJWT)

// Verify permissions
server.use(permissions)

// Handle routes
server.use('/', controllers)

// Handle not found route and global errors
server.use(notFound)
server.use(handleError)

server.listen(port, (): void => {
  console.log('--------------------------')
  console.log('Server is up on PORT:', port)
  console.log('--------------------------')
})
