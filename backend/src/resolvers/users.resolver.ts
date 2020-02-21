import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  ID,
  ObjectType,
  Query,
  Authorized,
  FieldResolver,
  Root,
} from 'type-graphql'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { IsEmail } from 'class-validator'
import * as jwt from 'jsonwebtoken'
import { render } from 'mjml-react'
import * as uuid from 'uuid'

import { User } from '../entity/User'
import { sendMail } from '../config/mailer'
import { UserRepository } from '../repositories/UserRepository'
import { Subscription } from '../entity/Subscription'
import { checkPassword, generatePasswordHash } from '../lib/security'
import { CurrentUser } from '../lib/Context'
import { ResetPassword } from '../mails/reset-password/ResetPassword'

@InputType()
class SubscriberInput {
  @Field({ nullable: true })
  public id: string

  @IsEmail()
  @Field()
  public email: string

  @Field({ nullable: true })
  public createdAt: Date
}

@InputType()
class ProfileUpdate {
  @IsEmail()
  @Field({ nullable: true })
  public email: string

  @Field({ nullable: true })
  public password: string
}

@ObjectType()
class LoginResponse {
  @Field()
  public success: boolean

  @Field({ nullable: true })
  public jwt: string
}

const signUserId = (user: User) => {
  if (!process.env.SESSION_KEY) throw new Error('`SESSION_KEY` not declared')
  return jwt.sign({ id: user.id }, process.env.SESSION_KEY)
}

@Resolver(() => User)
export class UserResolver {
  public constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>
  ) {}

  @FieldResolver(() => [Subscription])
  public async subscriptions(@Root() user: User) {
    return await this.subscriptionRepository.find({ user })
  }

  @Query(() => User)
  @Authorized()
  public me(@CurrentUser() currentUser: User) {
    return currentUser
  }

  @Mutation(() => User)
  @Authorized()
  public async updateAccount(
    @Arg('account') account: ProfileUpdate,
    @CurrentUser() currentUser: User
  ) {
    return await this.userRepository.save({ ...currentUser, ...account })
  }

  @Mutation(() => Boolean)
  public async subscribe(
    @Arg('subscriber') input: SubscriberInput,
    @Arg('theaterId', () => ID) theaterId: string
  ) {
    const user = await this.userRepository.findOrCreate(input.email)
    const subscription = await this.subscriptionRepository.findOne({
      userId: user.id,
      theaterId: theaterId,
    })
    if (!subscription) {
      await this.subscriptionRepository.save({ theaterId, user })
      return true
    } else {
      return false
    }
  }

  @Mutation(() => User)
  public async unsubscribe(@Arg('id', () => ID) id: string) {
    const subscriber = await this.userRepository.findOneOrFail({ id })
    await this.userRepository.delete({ id })
    return subscriber
  }

  @Mutation(() => LoginResponse)
  public async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const response = new LoginResponse()
    const user = await this.userRepository.findOne({ email })
    if (!user) {
      response.success = false
      return response
    }
    const check = await checkPassword(user.passwordHash, password)
    if (!check) {
      response.success = false
      return response
    }

    response.success = true
    response.jwt = signUserId(user)
    return response
  }

  @Mutation(() => LoginResponse)
  public async createAccount(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const user = await this.userRepository.save({
      email,
      password,
    })

    const response = new LoginResponse()
    response.success = true
    response.jwt = signUserId(user)

    return response
  }

  @Mutation(() => Boolean)
  public async resetPasswordRequest(@Arg('email') email: string) {
    const user = await this.userRepository.findOne({ email })
    if (!user) return false

    const resetPasswordToken = uuid.v4()
    await this.userRepository.save({ ...user, resetPasswordToken })

    const { html } = render(ResetPassword({ token: resetPasswordToken }))
    sendMail(user.email, 'Changer de mot de passe', html)
    return true
  }

  @Mutation(() => LoginResponse)
  public async resetPassword(
    @Arg('resetPasswordToken') resetPasswordToken: string,
    @Arg('password') password: string
  ) {
    const response = new LoginResponse()

    const user = await this.userRepository.findOne({ resetPasswordToken })
    if (!user) {
      response.success = false
    } else {
      await this.userRepository.save({
        ...user,
        passwordHash: await generatePasswordHash(password),
      })
      response.success = true
      response.jwt = signUserId(user)
    }
    return response
  }
}
