import bcrypt from 'bcrypt'

export default async (password: string): Promise<string> => bcrypt.hash(password, 10)
