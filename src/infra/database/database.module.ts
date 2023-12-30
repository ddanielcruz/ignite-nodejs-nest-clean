import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import {
  QuestionsRepository,
  PrismaQuestionsRepository,
} from './prisma/repositories/prisma-questions-repository'
import {
  StudentsRepository,
  PrismaStudentsRepository,
} from './prisma/repositories/prisma-students-repository'

@Module({
  providers: [
    PrismaService,
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
  ],
  exports: [PrismaService, QuestionsRepository, StudentsRepository],
})
export class DatabaseModule {}
