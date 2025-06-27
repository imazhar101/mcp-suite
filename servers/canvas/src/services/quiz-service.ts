import { AxiosInstance } from "axios";
import {
  Quiz,
  QuizQuestion,
  QuizListParams,
  QuizCreateParams,
  QuizUpdateParams,
  QuizQuestionCreateParams,
  QuizQuestionUpdateParams,
  QuizQuestionListParams,
} from "../types/quiz.js";

export class QuizService {
  constructor(private canvasClient: AxiosInstance) {}

  // Quiz Management
  async listQuizzes(
    courseId: string,
    params: QuizListParams = {}
  ): Promise<Quiz[]> {
    const queryParams: any = {};

    if (params.search_term) {
      queryParams.search_term = params.search_term;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/quizzes`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async getQuiz(courseId: string, quizId: string): Promise<Quiz> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/quizzes/${quizId}`
    );
    return response.data;
  }

  async createQuiz(courseId: string, params: QuizCreateParams): Promise<Quiz> {
    const requestData: any = {
      quiz: {},
    };

    // Map parameters to the quiz object
    Object.keys(params).forEach((key) => {
      requestData.quiz[key] = params[key as keyof QuizCreateParams];
    });

    const response = await this.canvasClient.post(
      `/courses/${courseId}/quizzes`,
      requestData
    );
    return response.data;
  }

  async updateQuiz(
    courseId: string,
    quizId: string,
    params: QuizUpdateParams
  ): Promise<Quiz> {
    const requestData: any = {
      quiz: {},
    };

    // Map parameters to the quiz object
    Object.keys(params).forEach((key) => {
      requestData.quiz[key] = params[key as keyof QuizUpdateParams];
    });

    const response = await this.canvasClient.put(
      `/courses/${courseId}/quizzes/${quizId}`,
      requestData
    );
    return response.data;
  }

  async deleteQuiz(courseId: string, quizId: string): Promise<Quiz> {
    const response = await this.canvasClient.delete(
      `/courses/${courseId}/quizzes/${quizId}`
    );
    return response.data;
  }

  async reorderQuizItems(
    courseId: string,
    quizId: string,
    order: Array<{ id: number; type?: "question" | "group" }>
  ): Promise<void> {
    const requestData = {
      order: order,
    };

    await this.canvasClient.post(
      `/courses/${courseId}/quizzes/${quizId}/reorder`,
      requestData
    );
  }

  async validateAccessCode(
    courseId: string,
    quizId: string,
    accessCode: string
  ): Promise<boolean> {
    const requestData = {
      access_code: accessCode,
    };

    const response = await this.canvasClient.post(
      `/courses/${courseId}/quizzes/${quizId}/validate_access_code`,
      requestData
    );
    return response.data;
  }

  // Quiz Questions Management
  async listQuizQuestions(
    courseId: string,
    quizId: string,
    params: QuizQuestionListParams = {}
  ): Promise<QuizQuestion[]> {
    const queryParams: any = {};

    if (params.quiz_submission_id) {
      queryParams.quiz_submission_id = params.quiz_submission_id;
    }
    if (params.quiz_submission_attempt) {
      queryParams.quiz_submission_attempt = params.quiz_submission_attempt;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/quizzes/${quizId}/questions`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async getQuizQuestion(
    courseId: string,
    quizId: string,
    questionId: string
  ): Promise<QuizQuestion> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`
    );
    return response.data;
  }

  async createQuizQuestion(
    courseId: string,
    quizId: string,
    params: QuizQuestionCreateParams
  ): Promise<QuizQuestion> {
    const requestData: any = {
      question: {},
    };

    // Map parameters to the question object
    Object.keys(params).forEach((key) => {
      requestData.question[key] = params[key as keyof QuizQuestionCreateParams];
    });

    const response = await this.canvasClient.post(
      `/courses/${courseId}/quizzes/${quizId}/questions`,
      requestData
    );
    return response.data;
  }

  async updateQuizQuestion(
    courseId: string,
    quizId: string,
    questionId: string,
    params: QuizQuestionUpdateParams
  ): Promise<QuizQuestion> {
    const requestData: any = {
      question: {},
    };

    // Map parameters to the question object
    Object.keys(params).forEach((key) => {
      requestData.question[key] = params[key as keyof QuizQuestionUpdateParams];
    });

    const response = await this.canvasClient.put(
      `/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`,
      requestData
    );
    return response.data;
  }

  async deleteQuizQuestion(
    courseId: string,
    quizId: string,
    questionId: string
  ): Promise<void> {
    await this.canvasClient.delete(
      `/courses/${courseId}/quizzes/${quizId}/questions/${questionId}`
    );
  }
}
