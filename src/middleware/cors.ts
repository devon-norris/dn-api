import cors from 'cors'
import config from '../config'
const { allowedOrigins, isDevelopment } = config

const corsConfig: cors.CorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  // @ts-ignore
  origin: (origin: string, callback: Function) => {
    if (allowedOrigins.includes(origin) || (isDevelopment && !origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

export default cors(corsConfig)
