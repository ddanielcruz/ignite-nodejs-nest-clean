import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import {
  PrismaQuestionsRepository,
  QuestionsRepository,
} from './prisma/repositories/prisma-questions-repository'

@Module({
  providers: [
    PrismaService,
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
  ],
  exports: [PrismaService, QuestionsRepository],
})
export class DatabaseModule {}
