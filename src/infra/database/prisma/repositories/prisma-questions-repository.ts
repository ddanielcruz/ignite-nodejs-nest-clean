import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { id } })
    return question ? PrismaQuestionMapper.toDomain(question) : null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { slug } })
    return question ? PrismaQuestionMapper.toDomain(question) : null
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const perPage = 20
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.update({
      where: { id: question.id.toString() },
      data,
    })
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await this.prisma.question.create({ data })
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({ where: { id: question.id.toString() } })
  }
}

export { QuestionsRepository }
