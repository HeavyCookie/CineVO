import { gql, UserInputError } from 'apollo-server'
import { getConnection, getManager } from 'typeorm'
import { subscribe } from 'graphql'
import { connect, query } from '../tests/utils'
import { Subscriber } from '../entity/Subscriber'

beforeAll(async () => await connect())

const SUBSCRIBE = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribe(subscriber: { email: $email })
  }
`

const UNSUBSCRIBE = gql`
  mutation unsusbscribeFromNewsletter($userId: ID!) {
    unsubscribe(id: $userId)
  }
`

describe('subscribers.resolver', () => {
  describe('subscribe mutation', () => {
    it('create a new subscriber', async () => {
      const result = await query(SUBSCRIBE, { email: 'test@test.test' })

      expect(result.data.subscribe).toBeTruthy()
    })

    it("couldn't create 2 user with the same email", async () => {
      const result = await query(SUBSCRIBE, { email: 'test@test.test' })

      expect(result.data.subscribe).toBeFalsy()
    })

    it("couldn't create an account with a malformed email address", async () => {
      const result = await query(SUBSCRIBE, { email: 'test@' })

      expect(result.data).toBeNull()
      expect(result.errors).toHaveLength(1)
    })
  })

  describe('unsubscribe mutation', () => {
    it('it works when user has already be subscribed', async () => {
      const subscriber = (await getManager().save(
        Subscriber,
        {
          email: 'future@unsubscribed.person',
        },
        { reload: true }
      )) as Subscriber

      const result = await query(UNSUBSCRIBE, { userId: subscriber.id })
      expect(result.data.unsubscribe).toBeTruthy()
    })

    it('return false when userId is wrong', async () => {
      const result = await query(UNSUBSCRIBE, { userId: 'AVERYWRONGID' })
      expect(result.data.unsubscribe).toBeFalsy()
    })
  })
})
