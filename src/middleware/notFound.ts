import { Request, Response } from '../types'
import { notFound } from '../util/responses'

export default (req: Request, res: Response): Response => notFound(res)
