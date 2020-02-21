import { ApolloServerExpressConfig } from 'apollo-server-express'
import { Request } from 'express'
import { AuthChecker, createParamDecorator } from 'type-graphql'
import { getRepository } from 'typeorm'

import { User } from '../entity/User'

export interface Context {
  currentUserId?: User['id']
  req: Request
}

export const context: ApolloServerExpressConfig['context'] = ({
  req,
}): Context => {
  const request: Request & { user?: { id?: string } } = req
  return {
    req,
    currentUserId: request?.['user']?.['id'],
  }
}

export const authChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles
) => {
  if (!context.currentUserId) return false
  if (roles.length == 0) return true

  return false
}

export const CurrentUser = () =>
  createParamDecorator<Context>(
    ({ context }) =>
      context.currentUserId &&
      getRepository(User).findOneOrFail(context.currentUserId)
  )
