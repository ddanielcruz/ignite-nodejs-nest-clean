import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest()
    return request.user
  },
)
