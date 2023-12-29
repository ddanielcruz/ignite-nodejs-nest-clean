import { BadRequestException, PipeTransform } from '@nestjs/common'
import type { ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
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
