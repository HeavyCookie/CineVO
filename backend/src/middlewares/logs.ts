import { MiddlewareFn } from 'type-graphql'

export const Logs: MiddlewareFn = async (action, next) => {
  let prefix = ''
  if (action.info.path.prev !== undefined) {
    prefix = ' ↳ '
  }
  const start = Date.now()
  await next()
  const resolveTime = Date.now() - start
  console.log(
    `${prefix}${action.info.parentType.name}.${action.info.fieldName}${
      Object.keys(action.args).length ? ' ' + JSON.stringify(action.args) : ''
    } [${resolveTime} ms]`
  )
}
