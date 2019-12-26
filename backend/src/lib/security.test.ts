import {
  generatePassword,
  generatePasswordHash,
  checkPassword,
} from './security'

describe('generatePassword', () => {
  it('generate a 20 char password', async () => {
    const password = await generatePassword()
    expect(password.length).toEqual(20)
  })
})

describe('generatePasswordHash', () => {
  it('generate a string different than the one provided', async () => {
    const input = 'my password'
    const output = await generatePasswordHash(input)

    expect(input).not.toEqual(output)
  })

  it('generate a password that can be checked with checkPassword', async () => {
    const input = 'my password'
    const output = await generatePasswordHash(input)
    const isEqual = await checkPassword(output, input)

    expect(isEqual).toBeTruthy()
  })
})

describe(checkPassword, () => {
  it('return true if the password provided matches the hash', async () => {
    const input = 'my password'
    const output = await generatePasswordHash(input)
    const isEqual = await checkPassword(output, input)

    expect(isEqual).toBeTruthy()
  })

  it("return false if the password provided doesn't match the hash", async () => {
    const input = 'my password'
    const output = await generatePasswordHash(input)
    const isEqual = await checkPassword(output, 'another input')

    expect(isEqual).toBeFalsy()
  })
})
