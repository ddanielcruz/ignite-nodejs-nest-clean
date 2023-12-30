import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common'
import type { ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

interface ZodValidationOptions {
  type?: ArgumentMetadata['type']
  data?: ArgumentMetadata['data']
}

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private readonly schema: ZodSchema,
    private readonly options?: ZodValidationOptions,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (this.options?.type && metadata.type !== this.options.type) {
      return value
    }

    if (this.options?.data && metadata.data !== this.options.data) {
      return value
    }

    const result = this.schema.safeParse(value)
    if (result.success) {
      return result.data
    }

    throw new BadRequestException({
      message: 'Validation failed.',
      statusCode: 400,
      errors: fromZodError(result.error).details,
    })
  }
}
