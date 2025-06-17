import { QuizService } from "../services/quiz-service.js";

export class QuizTools {
  constructor(private quizService: QuizService) {}

  getToolDefinitions() {
    return [
      {
        name: "list_quizzes",
        description: "List quizzes in a course",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            search_term: {
              type: "string",
              description: "Search term to filter quizzes",
            },
          },
          required: ["course_id"],
        },
      },
      {
        name: "get_quiz",
        description: "Get details of a specific quiz",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
          },
          required: ["course_id", "quiz_id"],
        },
      },
      {
        name: "create_quiz",
        description: "Create a new quiz",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            title: {
              type: "string",
              description: "Quiz title",
            },
            description: {
              type: "string",
              description: "Quiz description",
            },
            quiz_type: {
              type: "string",
              enum: ["practice_quiz", "assignment", "graded_survey", "survey"],
              description: "Type of quiz",
            },
            assignment_group_id: {
              type: "number",
              description: "Assignment group ID",
            },
            time_limit: {
              type: "number",
              description: "Time limit in minutes",
            },
            shuffle_answers: {
              type: "boolean",
              description: "Shuffle answer choices",
            },
            hide_results: {
              type: "string",
              enum: ["always", "until_after_last_attempt"],
              description: "When to hide results from students",
            },
            show_correct_answers: {
              type: "boolean",
              description: "Show correct answers to students",
            },
            show_correct_answers_last_attempt: {
              type: "boolean",
              description: "Show correct answers only after last attempt",
            },
            show_correct_answers_at: {
              type: "string",
              description: "Date when correct answers become visible (ISO 8601)",
            },
            hide_correct_answers_at: {
              type: "string",
              description: "Date when correct answers are hidden (ISO 8601)",
            },
            allowed_attempts: {
              type: "number",
              description: "Number of allowed attempts (-1 for unlimited)",
            },
            scoring_policy: {
              type: "string",
              enum: ["keep_highest", "keep_latest"],
              description: "Scoring policy for multiple attempts",
            },
            one_question_at_a_time: {
              type: "boolean",
              description: "Show one question at a time",
            },
            cant_go_back: {
              type: "boolean",
              description: "Prevent going back to previous questions",
            },
            access_code: {
              type: "string",
              description: "Access code required to take quiz",
            },
            ip_filter: {
              type: "string",
              description: "IP address filter for quiz access",
            },
            due_at: {
              type: "string",
              description: "Due date (ISO 8601 format)",
            },
            lock_at: {
              type: "string",
              description: "Lock date (ISO 8601 format)",
            },
            unlock_at: {
              type: "string",
              description: "Unlock date (ISO 8601 format)",
            },
            published: {
              type: "boolean",
              description: "Publish the quiz",
            },
            one_time_results: {
              type: "boolean",
              description: "Allow viewing results only once",
            },
            only_visible_to_overrides: {
              type: "boolean",
              description: "Only visible to overrides",
            },
          },
          required: ["course_id", "title"],
        },
      },
      {
        name: "update_quiz",
        description: "Update an existing quiz",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
            title: {
              type: "string",
              description: "Quiz title",
            },
            description: {
              type: "string",
              description: "Quiz description",
            },
            quiz_type: {
              type: "string",
              enum: ["practice_quiz", "assignment", "graded_survey", "survey"],
              description: "Type of quiz",
            },
            assignment_group_id: {
              type: "number",
              description: "Assignment group ID",
            },
            time_limit: {
              type: "number",
              description: "Time limit in minutes",
            },
            shuffle_answers: {
              type: "boolean",
              description: "Shuffle answer choices",
            },
            hide_results: {
              type: "string",
              enum: ["always", "until_after_last_attempt"],
              description: "When to hide results from students",
            },
            show_correct_answers: {
              type: "boolean",
              description: "Show correct answers to students",
            },
            show_correct_answers_last_attempt: {
              type: "boolean",
              description: "Show correct answers only after last attempt",
            },
            show_correct_answers_at: {
              type: "string",
              description: "Date when correct answers become visible (ISO 8601)",
            },
            hide_correct_answers_at: {
              type: "string",
              description: "Date when correct answers are hidden (ISO 8601)",
            },
            allowed_attempts: {
              type: "number",
              description: "Number of allowed attempts (-1 for unlimited)",
            },
            scoring_policy: {
              type: "string",
              enum: ["keep_highest", "keep_latest"],
              description: "Scoring policy for multiple attempts",
            },
            one_question_at_a_time: {
              type: "boolean",
              description: "Show one question at a time",
            },
            cant_go_back: {
              type: "boolean",
              description: "Prevent going back to previous questions",
            },
            access_code: {
              type: "string",
              description: "Access code required to take quiz",
            },
            ip_filter: {
              type: "string",
              description: "IP address filter for quiz access",
            },
            due_at: {
              type: "string",
              description: "Due date (ISO 8601 format)",
            },
            lock_at: {
              type: "string",
              description: "Lock date (ISO 8601 format)",
            },
            unlock_at: {
              type: "string",
              description: "Unlock date (ISO 8601 format)",
            },
            published: {
              type: "boolean",
              description: "Publish the quiz",
            },
            one_time_results: {
              type: "boolean",
              description: "Allow viewing results only once",
            },
            only_visible_to_overrides: {
              type: "boolean",
              description: "Only visible to overrides",
            },
            notify_of_update: {
              type: "boolean",
              description: "Notify users of quiz update",
            },
          },
          required: ["course_id", "quiz_id"],
        },
      },
      {
        name: "delete_quiz",
        description: "Delete a quiz",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
          },
          required: ["course_id", "quiz_id"],
        },
      },
      {
        name: "reorder_quiz_items",
        description: "Reorder quiz questions or groups",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
            order: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                    description: "Item ID",
                  },
                  type: {
                    type: "string",
                    enum: ["question", "group"],
                    description: "Item type",
                  },
                },
                required: ["id"],
              },
              description: "Array of items in desired order",
            },
          },
          required: ["course_id", "quiz_id", "order"],
        },
      },
      {
        name: "validate_quiz_access_code",
        description: "Validate a quiz access code",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
            access_code: {
              type: "string",
              description: "Access code to validate",
            },
          },
          required: ["course_id", "quiz_id", "access_code"],
        },
      },
      // Quiz Questions
      {
        name: "list_quiz_questions",
        description: "List questions in a quiz",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
            quiz_submission_id: {
              type: "number",
              description: "Quiz submission ID for specific attempt",
            },
            quiz_submission_attempt: {
              type: "number",
              description: "Submission attempt number",
            },
          },
          required: ["course_id", "quiz_id"],
        },
      },
      {
        name: "get_quiz_question",
        description: "Get details of a specific quiz question",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
            question_id: {
              type: "string",
              description: "Question ID",
            },
          },
          required: ["course_id", "quiz_id", "question_id"],
        },
      },
      {
        name: "create_quiz_question",
        description: "Create a new quiz question",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
            question_name: {
              type: "string",
              description: "Question name",
            },
            question_text: {
              type: "string",
              description: "Question text",
            },
            quiz_group_id: {
              type: "number",
              description: "Quiz group ID",
            },
            question_type: {
              type: "string",
              enum: [
                "calculated_question",
                "essay_question",
                "file_upload_question",
                "fill_in_multiple_blanks_question",
                "matching_question",
                "multiple_answers_question",
                "multiple_choice_question",
                "multiple_dropdowns_question",
                "numerical_question",
                "short_answer_question",
                "text_only_question",
                "true_false_question",
              ],
              description: "Type of question",
            },
            position: {
              type: "number",
              description: "Question position in quiz",
            },
            points_possible: {
              type: "number",
              description: "Points possible for this question",
            },
            correct_comments: {
              type: "string",
              description: "Comments for correct answers",
            },
            incorrect_comments: {
              type: "string",
              description: "Comments for incorrect answers",
            },
            neutral_comments: {
              type: "string",
              description: "General comments",
            },
            text_after_answers: {
              type: "string",
              description: "Text to display after answers",
            },
            answers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  answer_text: {
                    type: "string",
                    description: "Answer text",
                  },
                  answer_weight: {
                    type: "number",
                    description: "Answer weight (0 for incorrect, 100 for correct)",
                  },
                  answer_comments: {
                    type: "string",
                    description: "Comments for this answer",
                  },
                  text_after_answers: {
                    type: "string",
                    description: "Text after this answer",
                  },
                  answer_match_left: {
                    type: "string",
                    description: "Left side for matching questions",
                  },
                  answer_match_right: {
                    type: "string",
                    description: "Right side for matching questions",
                  },
                  matching_answer_incorrect_matches: {
                    type: "string",
                    description: "Incorrect matches for matching questions",
                  },
                  numerical_answer_type: {
                    type: "string",
                    enum: ["exact_answer", "range_answer", "precision_answer"],
                    description: "Type of numerical answer",
                  },
                  exact: {
                    type: "number",
                    description: "Exact numerical answer",
                  },
                  margin: {
                    type: "number",
                    description: "Margin of error for exact answers",
                  },
                  approximate: {
                    type: "number",
                    description: "Approximate numerical answer",
                  },
                  precision: {
                    type: "number",
                    description: "Precision for approximate answers",
                  },
                  start: {
                    type: "number",
                    description: "Start of range for range answers",
                  },
                  end: {
                    type: "number",
                    description: "End of range for range answers",
                  },
                  blank_id: {
                    type: "number",
                    description: "Blank ID for fill-in-the-blank questions",
                  },
                },
                required: ["answer_text"],
              },
              description: "Array of answer choices",
            },
          },
          required: ["course_id", "quiz_id"],
        },
      },
      {
        name: "update_quiz_question",
        description: "Update an existing quiz question",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
            question_id: {
              type: "string",
              description: "Question ID",
            },
            question_name: {
              type: "string",
              description: "Question name",
            },
            question_text: {
              type: "string",
              description: "Question text",
            },
            quiz_group_id: {
              type: "number",
              description: "Quiz group ID",
            },
            question_type: {
              type: "string",
              enum: [
                "calculated_question",
                "essay_question",
                "file_upload_question",
                "fill_in_multiple_blanks_question",
                "matching_question",
                "multiple_answers_question",
                "multiple_choice_question",
                "multiple_dropdowns_question",
                "numerical_question",
                "short_answer_question",
                "text_only_question",
                "true_false_question",
              ],
              description: "Type of question",
            },
            position: {
              type: "number",
              description: "Question position in quiz",
            },
            points_possible: {
              type: "number",
              description: "Points possible for this question",
            },
            correct_comments: {
              type: "string",
              description: "Comments for correct answers",
            },
            incorrect_comments: {
              type: "string",
              description: "Comments for incorrect answers",
            },
            neutral_comments: {
              type: "string",
              description: "General comments",
            },
            text_after_answers: {
              type: "string",
              description: "Text to display after answers",
            },
            answers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  answer_text: {
                    type: "string",
                    description: "Answer text",
                  },
                  answer_weight: {
                    type: "number",
                    description: "Answer weight (0 for incorrect, 100 for correct)",
                  },
                  answer_comments: {
                    type: "string",
                    description: "Comments for this answer",
                  },
                  text_after_answers: {
                    type: "string",
                    description: "Text after this answer",
                  },
                  answer_match_left: {
                    type: "string",
                    description: "Left side for matching questions",
                  },
                  answer_match_right: {
                    type: "string",
                    description: "Right side for matching questions",
                  },
                  matching_answer_incorrect_matches: {
                    type: "string",
                    description: "Incorrect matches for matching questions",
                  },
                  numerical_answer_type: {
                    type: "string",
                    enum: ["exact_answer", "range_answer", "precision_answer"],
                    description: "Type of numerical answer",
                  },
                  exact: {
                    type: "number",
                    description: "Exact numerical answer",
                  },
                  margin: {
                    type: "number",
                    description: "Margin of error for exact answers",
                  },
                  approximate: {
                    type: "number",
                    description: "Approximate numerical answer",
                  },
                  precision: {
                    type: "number",
                    description: "Precision for approximate answers",
                  },
                  start: {
                    type: "number",
                    description: "Start of range for range answers",
                  },
                  end: {
                    type: "number",
                    description: "End of range for range answers",
                  },
                  blank_id: {
                    type: "number",
                    description: "Blank ID for fill-in-the-blank questions",
                  },
                },
                required: ["answer_text"],
              },
              description: "Array of answer choices",
            },
          },
          required: ["course_id", "quiz_id", "question_id"],
        },
      },
      {
        name: "delete_quiz_question",
        description: "Delete a quiz question",
        inputSchema: {
          type: "object",
          properties: {
            course_id: {
              type: "string",
              description: "Course ID",
            },
            quiz_id: {
              type: "string",
              description: "Quiz ID",
            },
            question_id: {
              type: "string",
              description: "Question ID",
            },
          },
          required: ["course_id", "quiz_id", "question_id"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "list_quizzes":
        const { course_id, ...listParams } = args;
        return await this.quizService.listQuizzes(course_id, listParams);

      case "get_quiz":
        return await this.quizService.getQuiz(args.course_id, args.quiz_id);

      case "create_quiz":
        const { course_id: createCourseId, ...createParams } = args;
        return await this.quizService.createQuiz(createCourseId, createParams);

      case "update_quiz":
        const {
          course_id: updateCourseId,
          quiz_id: updateQuizId,
          ...updateParams
        } = args;
        return await this.quizService.updateQuiz(
          updateCourseId,
          updateQuizId,
          updateParams
        );

      case "delete_quiz":
        return await this.quizService.deleteQuiz(args.course_id, args.quiz_id);

      case "reorder_quiz_items":
        return await this.quizService.reorderQuizItems(
          args.course_id,
          args.quiz_id,
          args.order
        );

      case "validate_quiz_access_code":
        return await this.quizService.validateAccessCode(
          args.course_id,
          args.quiz_id,
          args.access_code
        );

      // Quiz Questions
      case "list_quiz_questions":
        const {
          course_id: listQuestionsCourseId,
          quiz_id: listQuestionsQuizId,
          ...listQuestionsParams
        } = args;
        return await this.quizService.listQuizQuestions(
          listQuestionsCourseId,
          listQuestionsQuizId,
          listQuestionsParams
        );

      case "get_quiz_question":
        return await this.quizService.getQuizQuestion(
          args.course_id,
          args.quiz_id,
          args.question_id
        );

      case "create_quiz_question":
        const {
          course_id: createQuestionCourseId,
          quiz_id: createQuestionQuizId,
          ...createQuestionParams
        } = args;
        return await this.quizService.createQuizQuestion(
          createQuestionCourseId,
          createQuestionQuizId,
          createQuestionParams
        );

      case "update_quiz_question":
        const {
          course_id: updateQuestionCourseId,
          quiz_id: updateQuestionQuizId,
          question_id: updateQuestionId,
          ...updateQuestionParams
        } = args;
        return await this.quizService.updateQuizQuestion(
          updateQuestionCourseId,
          updateQuestionQuizId,
          updateQuestionId,
          updateQuestionParams
        );

      case "delete_quiz_question":
        return await this.quizService.deleteQuizQuestion(
          args.course_id,
          args.quiz_id,
          args.question_id
        );

      default:
        throw new Error(`Unknown quiz tool: ${name}`);
    }
  }
}
