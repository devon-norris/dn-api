import { RefreshTokenPayload } from './generateToken'

export default async (userId: string): Promise<RefreshTokenPayload> => ({
  userId,
})
