import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import controllers from './controllers'
import config from './config'
import mongoose from 'mongoose'
import { permissions, validateJWT, notFound, handleError } from './middleware'
const server = express()
const { db, loggingFormat, cookie, origin, port } = config

// Connect to DB
mongoose.connect(db.url, db.config)

// Initialize Server
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

// Handle route not found and global errors
server.use(notFound)
server.use(handleError)

server.listen(port, (): void => {
  console.log('--------------------------')
  console.log('Server is up on PORT:', port)
  console.log('--------------------------')
})
