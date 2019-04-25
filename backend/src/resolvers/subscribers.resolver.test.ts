import { gql } from 'apollo-server'
import { getManager } from 'typeorm'
import { connect, query, disconnect } from '../tests/utils'
import { Subscriber } from '../entity/Subscriber'

beforeAll(connect)
afterAll(disconnect)

describe('subscribers.resolver', () => {
  describe('subscribe mutation', () => {
    const MUTATION = gql`
      mutation subscribeToNewsletter($email: String!) {
        subscribe(subscriber: { email: $email })
      }
    `
    it('create a new subscriber', async () => {
      const result = await query(MUTATION, { email: 'test@test.test' })

      expect(result.data.subscribe).toBeTruthy()
    })

    it("couldn't create 2 user with the same email", async () => {
      const result = await query(MUTATION, { email: 'test@test.test' })

      expect(result.data.subscribe).toBeFalsy()
    })

    it("couldn't create an account with a malformed email address", async () => {
      const result = await query(MUTATION, { email: 'test@' })

      expect(result.data).toBeNull()
      expect(result.errors).toHaveLength(1)
    })
  })

  describe('unsubscribe mutation', () => {
    const MUTATION = gql`
      mutation unsusbscribeFromNewsletter($userId: ID!) {
        unsubscribe(id: $userId)
      }
    `

    it('it works when user has already be subscribed', async () => {
      const subscriber = (await getManager().save(
        Subscriber,
        {
          email: 'future@unsubscribed.person',
        },
        { reload: true }
      )) as Subscriber

      const result = await query(MUTATION, { userId: subscriber.id })
      expect(result.data.unsubscribe).toBeTruthy()
    })

    it('return false when userId is wrong', async () => {
      const result = await query(MUTATION, { userId: 'AVERYWRONGID' })
      expect(result.data.unsubscribe).toBeFalsy()
    })
  })
})
