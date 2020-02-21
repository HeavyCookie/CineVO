import { gql } from 'apollo-server-express'
import { getManager } from 'typeorm'
import * as uuid from 'uuid'

import { connect, query, disconnect } from '../tests/utils'
import { User } from '../entity/User'
import factories from '../tests/factories'
import { Theater } from '../entity/Theater'
import { generatePasswordHash, checkPassword } from '../lib/security'
import { sendMail } from '../config/mailer'

jest.mock('../config/mailer')

beforeAll(connect)
afterAll(disconnect)

describe('users.resolver', () => {
  describe('subscribe mutation', () => {
    const MUTATION = gql`
      mutation subscribeToNewsletter($email: String!, $theaterId: ID!) {
        subscribe(subscriber: { email: $email }, theaterId: $theaterId)
      }
    `
    it('create a new subscriber', async () => {
      const theater = getManager().create(Theater, factories.theater())
      await getManager().save(theater)

      const result = await query(MUTATION, {
        email: 'create-new-subscriber@test.test',
        theaterId: theater.id,
      })

      expect(result?.data?.subscribe).toBeTruthy()
    })

    it("couldn't create 2 user with the same email", async () => {
      const theater = getManager().create(Theater, factories.theater())
      await getManager().save(theater)
      await query(MUTATION, {
        email: '2-user-with-same-email@test.test',
        theaterId: theater.id,
      })
      const result = await query(MUTATION, {
        email: '2-user-with-same-email@test.test',
        theaterId: theater.id,
      })

      expect(result?.data?.subscribe).toBeFalsy()
    })

    it("couldn't create an account with a malformed email address", async () => {
      const theater = getManager().create(Theater, factories.theater())
      await getManager().save(theater)
      const result = await query(MUTATION, {
        email: 'test@',
        theaterId: theater.id,
      })

      expect(result.data).toBeNull()
      expect(result.errors).toHaveLength(1)
    })
  })

  describe('unsubscribe mutation', () => {
    const MUTATION = gql`
      mutation unsusbscribeFromNewsletter($userId: ID!) {
        unsubscribe(id: $userId) {
          id
          email
          createdAt
        }
      }
    `

    it('it works when user has already be subscribed', async () => {
      const subscriber = (await getManager().save(
        User,
        {
          email: 'future@unsubscribed.person',
          passwordHash: 'passwordHash',
        },
        { reload: true }
      )) as User

      const result = await query(MUTATION, { userId: subscriber.id })
      expect(result?.data?.unsubscribe).toBeTruthy()
    })

    it('return false when userId is wrong', async () => {
      const result = await query(MUTATION, {
        userId: '46d04622-7f53-465d-85a2-8d1074b428cf',
      })
      expect(result?.errors?.length || 0 > 0).toBeTruthy()
    })
  })

  describe('resetPasswordRequest', () => {
    const RESET_PASSWORD_REQUEST_MUTATION = gql`
      mutation resetPasswordRequest($email: String!) {
        resetPasswordRequest(email: $email)
      }
    `
    it('returns true if user exists', async () => {
      const email = 'request-reset-password-1@test.test'
      const user = getManager().create(User, {
        email,
        passwordHash: await generatePasswordHash('password'),
      })
      await getManager().save(user)

      const result = await query(RESET_PASSWORD_REQUEST_MUTATION, { email })
      expect(result?.data?.resetPasswordRequest).toBeTruthy()
    })

    it('sends an email', async () => {
      const email = 'request-reset-password-2@test.test'
      const user = getManager().create(User, {
        email,
        passwordHash: await generatePasswordHash('password'),
      })
      await getManager().save(user)

      await query(RESET_PASSWORD_REQUEST_MUTATION, { email })
      expect(sendMail).toBeCalled()
    })

    it('update user resetPasswordToken', async () => {
      const email = 'request-reset-password-3@test.test'
      const user = getManager().create(User, {
        email,
        passwordHash: await generatePasswordHash('password'),
      })
      await getManager().save(user)

      await query(RESET_PASSWORD_REQUEST_MUTATION, { email })
      const updatedUser = await getManager().findOne(User, { id: user.id })
      expect(updatedUser?.resetPasswordToken).not.toBeNull()
    })

    it('return false if there is no user with this email', async () => {
      const result = await query(RESET_PASSWORD_REQUEST_MUTATION, {
        email: 'undefined-email@test.test',
      })

      expect(result?.data?.resetPasswordRequest).toBeFalsy()
    })
  })

  describe('resetPassword', () => {
    const RESET_PASSWORD_MUTATION = gql`
      mutation resetPassword($resetPasswordToken: String!, $password: String!) {
        resetPassword(
          resetPasswordToken: $resetPasswordToken
          password: $password
        ) {
          success
          jwt
        }
      }
    `
    it('return false if token is not found in db', async () => {
      const result = await query(RESET_PASSWORD_MUTATION, {
        resetPasswordToken: uuid.v4(),
        password: 'new password',
      })

      expect(result?.data?.resetPassword.success).toStrictEqual(false)
    })

    it('retun true if token is present in database', async () => {
      const resetPasswordToken = uuid.v4()
      const email = 'reset-password-1@test.test'
      const password = 'original-password'
      const user = getManager().create(User, {
        email,
        password,
        passwordHash: await generatePasswordHash(password),
        resetPasswordToken,
      })

      await getManager().save(user)

      const result = await query(RESET_PASSWORD_MUTATION, {
        resetPasswordToken,
        password: 'new-password',
      })

      expect(result?.data?.resetPassword.success).toStrictEqual(true)
    })

    it('updates the password', async () => {
      const resetPasswordToken = uuid.v4()
      const email = 'reset-password-2@test.test'
      const password = 'original-password'
      const newPassword = 'new-password'
      const user = getManager().create(User, {
        email,
        password,
        passwordHash: await generatePasswordHash(password),
        resetPasswordToken,
      })

      await getManager().save(user)

      await query(RESET_PASSWORD_MUTATION, {
        resetPasswordToken,
        password: newPassword,
      })

      const reloadedUser = await getManager().findOne(User, { id: user.id })
      if (!reloadedUser) throw Error('no user')

      expect(user.passwordHash).not.toEqual(reloadedUser?.passwordHash)

      expect(
        await checkPassword(reloadedUser.passwordHash, newPassword)
      ).toStrictEqual(true)
    })
  })
})
