import { AxiosInstance } from "axios";
import {
  Submission,
  SubmissionListParams,
  SubmissionMultipleParams,
  SubmissionShowParams,
  SubmissionCreateParams,
  SubmissionUpdateParams,
  SubmissionCommentParams,
  BulkUpdateGradeData,
  SubmissionSummary,
  GradeableStudent,
  Day,
  Grader,
  SubmissionHistory,
  SubmissionVersion,
  GradebookHistoryFeedParams,
} from "../types/submission.js";

export class SubmissionService {
  constructor(private canvasClient: AxiosInstance) {}

  // Submission CRUD operations
  async submitAssignment(
    courseId: string,
    assignmentId: string,
    params: SubmissionCreateParams & { comment?: SubmissionCommentParams }
  ): Promise<Submission> {
    const requestData: any = {
      submission: {
        submission_type: params.submission_type,
      },
    };

    // Add submission parameters
    if (params.body) requestData.submission.body = params.body;
    if (params.url) requestData.submission.url = params.url;
    if (params.file_ids) requestData.submission["file_ids[]"] = params.file_ids;
    if (params.media_comment_id)
      requestData.submission.media_comment_id = params.media_comment_id;
    if (params.media_comment_type)
      requestData.submission.media_comment_type = params.media_comment_type;
    if (params.user_id) requestData.submission.user_id = params.user_id;
    if (params.annotatable_attachment_id)
      requestData.submission.annotatable_attachment_id =
        params.annotatable_attachment_id;
    if (params.submitted_at)
      requestData.submission.submitted_at = params.submitted_at;

    // Add comment parameters
    if (params.comment?.text_comment) {
      requestData["comment[text_comment]"] = params.comment.text_comment;
      if (params.comment.group_comment !== undefined) {
        requestData.submission.group_comment = params.comment.group_comment;
      }
    }

    const response = await this.canvasClient.post(
      `/courses/${courseId}/assignments/${assignmentId}/submissions`,
      requestData
    );
    return response.data;
  }

  async listAssignmentSubmissions(
    courseId: string,
    assignmentId: string,
    params: SubmissionListParams = {}
  ): Promise<Submission[]> {
    const queryParams: any = {};

    if (params.include) {
      queryParams["include[]"] = params.include;
    }
    if (params.grouped !== undefined) {
      queryParams.grouped = params.grouped;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}/submissions`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async listSubmissionsForMultipleAssignments(
    courseId: string,
    params: SubmissionMultipleParams = {}
  ): Promise<Submission[]> {
    const queryParams: any = {};

    if (params.student_ids) {
      queryParams["student_ids[]"] = params.student_ids;
    }
    if (params.assignment_ids) {
      queryParams["assignment_ids[]"] = params.assignment_ids;
    }
    if (params.grouped !== undefined) {
      queryParams.grouped = params.grouped;
    }
    if (params.post_to_sis !== undefined) {
      queryParams.post_to_sis = params.post_to_sis;
    }
    if (params.submitted_since) {
      queryParams.submitted_since = params.submitted_since;
    }
    if (params.graded_since) {
      queryParams.graded_since = params.graded_since;
    }
    if (params.grading_period_id) {
      queryParams.grading_period_id = params.grading_period_id;
    }
    if (params.workflow_state) {
      queryParams.workflow_state = params.workflow_state;
    }
    if (params.enrollment_state) {
      queryParams.enrollment_state = params.enrollment_state;
    }
    if (params.state_based_on_date !== undefined) {
      queryParams.state_based_on_date = params.state_based_on_date;
    }
    if (params.order) {
      queryParams.order = params.order;
    }
    if (params.order_direction) {
      queryParams.order_direction = params.order_direction;
    }
    if (params.include) {
      queryParams["include[]"] = params.include;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/students/submissions`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async getSubmission(
    courseId: string,
    assignmentId: string,
    userId: string,
    params: SubmissionShowParams = {}
  ): Promise<Submission> {
    const queryParams: any = {};

    if (params.include) {
      queryParams["include[]"] = params.include;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async getSubmissionByAnonymousId(
    courseId: string,
    assignmentId: string,
    anonymousId: string,
    params: SubmissionShowParams = {}
  ): Promise<Submission> {
    const queryParams: any = {};

    if (params.include) {
      queryParams["include[]"] = params.include;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}/anonymous_submissions/${anonymousId}`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async gradeSubmission(
    courseId: string,
    assignmentId: string,
    userId: string,
    params: {
      submission?: SubmissionUpdateParams;
      comment?: SubmissionCommentParams;
      rubric_assessment?: any;
      include_visibility?: string;
      prefer_points_over_scheme?: boolean;
    }
  ): Promise<Submission> {
    const requestData: any = {};

    // Add submission grading parameters
    if (params.submission) {
      requestData.submission = params.submission;
    }

    // Add comment parameters
    if (params.comment) {
      if (params.comment.text_comment) {
        requestData["comment[text_comment]"] = params.comment.text_comment;
      }
      if (params.comment.attempt) {
        requestData["comment[attempt]"] = params.comment.attempt;
      }
      if (params.comment.group_comment !== undefined) {
        requestData["comment[group_comment]"] = params.comment.group_comment;
      }
      if (params.comment.media_comment_id) {
        requestData["comment[media_comment_id]"] =
          params.comment.media_comment_id;
      }
      if (params.comment.media_comment_type) {
        requestData["comment[media_comment_type]"] =
          params.comment.media_comment_type;
      }
      if (params.comment.file_ids) {
        requestData["comment[file_ids][]"] = params.comment.file_ids;
      }
    }

    // Add rubric assessment
    if (params.rubric_assessment) {
      requestData.rubric_assessment = params.rubric_assessment;
    }

    // Add other parameters
    if (params.include_visibility) {
      requestData["include[visibility]"] = params.include_visibility;
    }
    if (params.prefer_points_over_scheme !== undefined) {
      requestData.prefer_points_over_scheme = params.prefer_points_over_scheme;
    }

    const response = await this.canvasClient.put(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}`,
      requestData
    );
    return response.data;
  }

  async gradeSubmissionByAnonymousId(
    courseId: string,
    assignmentId: string,
    anonymousId: string,
    params: {
      submission?: SubmissionUpdateParams;
      comment?: SubmissionCommentParams;
      rubric_assessment?: any;
      include_visibility?: string;
    }
  ): Promise<Submission> {
    const requestData: any = {};

    // Add submission grading parameters
    if (params.submission) {
      requestData.submission = params.submission;
    }

    // Add comment parameters
    if (params.comment) {
      if (params.comment.text_comment) {
        requestData["comment[text_comment]"] = params.comment.text_comment;
      }
      if (params.comment.group_comment !== undefined) {
        requestData["comment[group_comment]"] = params.comment.group_comment;
      }
      if (params.comment.media_comment_id) {
        requestData["comment[media_comment_id]"] =
          params.comment.media_comment_id;
      }
      if (params.comment.media_comment_type) {
        requestData["comment[media_comment_type]"] =
          params.comment.media_comment_type;
      }
      if (params.comment.file_ids) {
        requestData["comment[file_ids][]"] = params.comment.file_ids;
      }
    }

    // Add rubric assessment
    if (params.rubric_assessment) {
      requestData.rubric_assessment = params.rubric_assessment;
    }

    // Add other parameters
    if (params.include_visibility) {
      requestData["include[visibility]"] = params.include_visibility;
    }

    const response = await this.canvasClient.put(
      `/courses/${courseId}/assignments/${assignmentId}/anonymous_submissions/${anonymousId}`,
      requestData
    );
    return response.data;
  }

  async listGradeableStudents(
    courseId: string,
    assignmentId: string
  ): Promise<GradeableStudent[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}/gradeable_students`
    );
    return response.data;
  }

  async listMultipleAssignmentsGradeableStudents(
    courseId: string,
    assignmentIds: string[]
  ): Promise<GradeableStudent[]> {
    const params = {
      "assignment_ids[]": assignmentIds,
    };

    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/gradeable_students`,
      { params }
    );
    return response.data;
  }

  async bulkUpdateGrades(
    courseId: string,
    assignmentId: string,
    gradeData: BulkUpdateGradeData
  ): Promise<any> {
    const requestData: any = {};

    // Convert grade data to the expected format
    Object.keys(gradeData).forEach((studentId) => {
      const studentData = gradeData[studentId];
      Object.keys(studentData).forEach((key) => {
        requestData[`grade_data[${studentId}][${key}]`] =
          studentData[key as keyof typeof studentData];
      });
    });

    const response = await this.canvasClient.post(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/update_grades`,
      requestData
    );
    return response.data;
  }

  async bulkUpdateGradesForCourse(
    courseId: string,
    gradeData: BulkUpdateGradeData
  ): Promise<any> {
    const requestData: any = {};

    // Convert grade data to the expected format
    Object.keys(gradeData).forEach((studentId) => {
      const studentData = gradeData[studentId];
      Object.keys(studentData).forEach((key) => {
        requestData[`grade_data[${studentId}][${key}]`] =
          studentData[key as keyof typeof studentData];
      });
    });

    const response = await this.canvasClient.post(
      `/courses/${courseId}/submissions/update_grades`,
      requestData
    );
    return response.data;
  }

  // Read status management
  async markSubmissionAsRead(
    courseId: string,
    assignmentId: string,
    userId: string
  ): Promise<void> {
    await this.canvasClient.put(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/read`
    );
  }

  async markSubmissionAsUnread(
    courseId: string,
    assignmentId: string,
    userId: string
  ): Promise<void> {
    await this.canvasClient.delete(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/read`
    );
  }

  async markBulkSubmissionsAsRead(
    courseId: string,
    submissionIds: string[]
  ): Promise<void> {
    const requestData = {
      "submissionIds[]": submissionIds,
    };

    await this.canvasClient.put(
      `/courses/${courseId}/submissions/bulk_mark_read`,
      requestData
    );
  }

  async markSubmissionItemAsRead(
    courseId: string,
    assignmentId: string,
    userId: string,
    item: "grade" | "comment" | "rubric"
  ): Promise<void> {
    await this.canvasClient.put(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/read/${item}`
    );
  }

  async clearUnreadStatusForAllSubmissions(
    courseId: string,
    userId: string
  ): Promise<void> {
    await this.canvasClient.put(
      `/courses/${courseId}/submissions/${userId}/clear_unread`
    );
  }

  // Rubric assessments
  async getRubricAssessmentsReadState(
    courseId: string,
    assignmentId: string,
    userId: string
  ): Promise<{ read: boolean }> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/rubric_assessments/read`
    );
    return response.data;
  }

  async markRubricAssessmentsAsRead(
    courseId: string,
    assignmentId: string,
    userId: string
  ): Promise<{ read: boolean }> {
    const response = await this.canvasClient.put(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/rubric_assessments/read`
    );
    return response.data;
  }

  // Document annotations
  async getDocumentAnnotationsReadState(
    courseId: string,
    assignmentId: string,
    userId: string
  ): Promise<{ read: boolean }> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/document_annotations/read`
    );
    return response.data;
  }

  async markDocumentAnnotationsAsRead(
    courseId: string,
    assignmentId: string,
    userId: string
  ): Promise<{ read: boolean }> {
    const response = await this.canvasClient.put(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}/document_annotations/read`
    );
    return response.data;
  }

  // Submission summary
  async getSubmissionSummary(
    courseId: string,
    assignmentId: string,
    grouped?: boolean
  ): Promise<SubmissionSummary> {
    const params: any = {};
    if (grouped !== undefined) {
      params.grouped = grouped;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}/submission_summary`,
      { params }
    );
    return response.data;
  }

  // Gradebook History
  async getGradebookHistoryDays(courseId: string): Promise<Day[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/gradebook_history/days`
    );
    return response.data;
  }

  async getGradebookHistoryDayDetails(
    courseId: string,
    date: string
  ): Promise<Grader[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/gradebook_history/${date}`
    );
    return response.data;
  }

  async getGradebookHistorySubmissions(
    courseId: string,
    date: string,
    graderId: string,
    assignmentId: string
  ): Promise<SubmissionHistory[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/gradebook_history/${date}/graders/${graderId}/assignments/${assignmentId}/submissions`
    );
    return response.data;
  }

  async getGradebookHistoryFeed(
    courseId: string,
    params: GradebookHistoryFeedParams = {}
  ): Promise<SubmissionVersion[]> {
    const queryParams: any = {};

    if (params.assignment_id) {
      queryParams.assignment_id = params.assignment_id;
    }
    if (params.user_id) {
      queryParams.user_id = params.user_id;
    }
    if (params.ascending !== undefined) {
      queryParams.ascending = params.ascending;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/gradebook_history/feed`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }
}
