import { Question } from '@/domain/forum/enterprise/entities/question'

export class QuestionPresenter {
  static toHttp(question: Question) {
    return {
      id: question.id.toString(),
      bestAnswerId: question.bestAnswerId?.toString() ?? null,
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt ?? null,
    }
  }
}
