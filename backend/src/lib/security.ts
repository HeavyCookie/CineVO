import { randomFill } from 'crypto'
import { promisify } from 'util'

import { hash, compare } from 'bcrypt'
import * as R from 'remeda'

const authorizedPasswordChars =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'

const randomFillPromisified = promisify(randomFill)

export const generatePassword = async () => {
  const promises = R.pipe(
    Array(20).fill(authorizedPasswordChars),
    R.map(async (x: string) => {
      const randomCrypto = await randomFillPromisified(new Uint32Array(1))
      return x[Math.floor((randomCrypto[0] / (0xffffffff + 1)) * x.length)]
    })
  )
  const arrayPassword = await Promise.all(promises)
  return arrayPassword.join('')
}

export const generatePasswordHash = async (password?: string) => {
  const value = password ? password : await generatePassword()
  return await hash(value, 10)
}

export const checkPassword = (passwordHash: string, password: string) =>
  compare(password, passwordHash)
