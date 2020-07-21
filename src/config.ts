import dbConfig from './db/config'
const { environments } = dbConfig

const { SERVER_ENV = '' } = process.env
// @ts-ignore
if (!environments[SERVER_ENV]) throw new Error('Invalid SERVER_ENV')
const isDevelopment = SERVER_ENV === environments.development
if (isDevelopment) {
  require('dotenv').config()
}

const { PORT = '', TOKEN_SECRET = '', COOKIE_SECRET = '', DB_URL = '', ADMIN_ID = '' } = process.env

const checkUndefined = [TOKEN_SECRET, COOKIE_SECRET, DB_URL]
if (checkUndefined.some(v => v === '')) throw new Error('Invalid environment variable')

interface Config {
  port: string
  allowedOrigins: string[]
  tokenSecret: string
  cookie: {
    secret: string
    secure: boolean
    sameSite: boolean
  }
  db: {
    url: string
    config: {
      useNewUrlParser: boolean
      useUnifiedTopology: boolean
      useFindAndModify: boolean
      useCreateIndex: boolean
    }
  }
  loggingFormat: string
  isDevelopment: boolean
  adminId: string
}

let config: Config = {
  port: PORT,
  allowedOrigins: ['http://localhost:3000'],
  tokenSecret: TOKEN_SECRET,
  cookie: {
    secret: COOKIE_SECRET,
    secure: false,
    sameSite: false,
  },
  db: {
    url: `${DB_URL}/${SERVER_ENV}?${dbConfig.urlQueryParams}`,
    config: dbConfig.options,
  },
  loggingFormat: 'dev',
  isDevelopment,
  adminId: ADMIN_ID,
}

if (SERVER_ENV === environments.staging) {
  config = {
    ...config,
    allowedOrigins: ['https://southend-staging.web.app', 'https://staging.devon-norris.com'],
    cookie: {
      ...config.cookie,
      secure: true,
      sameSite: true,
    },
    loggingFormat: ':method :url :status :response-time ms - :date[web]',
  }
}

if (SERVER_ENV === environments.production) {
  config = {
    ...config,
    allowedOrigins: ['https://southend-fd01a.web.app', 'https://devon-norris.com'],
    cookie: {
      ...config.cookie,
      secure: true,
      sameSite: true,
    },
    loggingFormat: ':method :url :status :response-time ms - :date[web]',
  }
}

export default config
