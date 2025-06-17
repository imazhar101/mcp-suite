import { AxiosInstance } from "axios";
import {
  Enrollment,
  EnrollmentListParams,
  EnrollmentCreateParams,
  EnrollmentUpdateParams,
  EnrollmentAcceptRejectParams,
  EnrollmentReactivateParams,
  LastAttendedParams,
  TemporaryEnrollmentStatusParams,
  TemporaryEnrollmentStatus,
  EnrollmentContext,
} from "../types/enrollment.js";

export class EnrollmentService {
  constructor(private canvasClient: AxiosInstance) {}

  /**
   * List enrollments for a course, section, or user
   */
  async listEnrollments(
    context: EnrollmentContext,
    contextId: string,
    params: EnrollmentListParams = {}
  ): Promise<Enrollment[]> {
    const queryParams: any = {};

    // Handle array parameters
    if (params.type) {
      queryParams["type[]"] = params.type;
    }
    if (params.role) {
      queryParams["role[]"] = params.role;
    }
    if (params.state) {
      queryParams["state[]"] = params.state;
    }
    if (params.include) {
      queryParams["include[]"] = params.include;
    }
    if (params.sis_account_id) {
      queryParams["sis_account_id[]"] = params.sis_account_id;
    }
    if (params.sis_course_id) {
      queryParams["sis_course_id[]"] = params.sis_course_id;
    }
    if (params.sis_section_id) {
      queryParams["sis_section_id[]"] = params.sis_section_id;
    }
    if (params.sis_user_id) {
      queryParams["sis_user_id[]"] = params.sis_user_id;
    }

    // Handle single value parameters
    if (params.user_id) {
      queryParams.user_id = params.user_id;
    }
    if (params.grading_period_id) {
      queryParams.grading_period_id = params.grading_period_id;
    }
    if (params.enrollment_term_id) {
      queryParams.enrollment_term_id = params.enrollment_term_id;
    }
    if (params.created_for_sis_id !== undefined) {
      queryParams.created_for_sis_id = params.created_for_sis_id;
    }

    let endpoint: string;
    switch (context) {
      case "course":
        endpoint = `/courses/${contextId}/enrollments`;
        break;
      case "section":
        endpoint = `/sections/${contextId}/enrollments`;
        break;
      case "user":
        endpoint = `/users/${contextId}/enrollments`;
        break;
      default:
        throw new Error(`Invalid enrollment context: ${context}`);
    }

    const response = await this.canvasClient.get(endpoint, {
      params: queryParams,
    });
    return response.data;
  }

  /**
   * Get a specific enrollment by ID
   */
  async getEnrollment(
    accountId: string,
    enrollmentId: string
  ): Promise<Enrollment> {
    const response = await this.canvasClient.get(
      `/accounts/${accountId}/enrollments/${enrollmentId}`
    );
    return response.data;
  }

  /**
   * Create a new enrollment in a course
   */
  async createEnrollment(
    context: "course" | "section",
    contextId: string,
    params: EnrollmentCreateParams
  ): Promise<Enrollment> {
    const requestData = {
      enrollment: params,
    };

    let endpoint: string;
    if (context === "course") {
      endpoint = `/courses/${contextId}/enrollments`;
    } else {
      endpoint = `/sections/${contextId}/enrollments`;
    }

    const response = await this.canvasClient.post(endpoint, requestData);
    return response.data;
  }

  /**
   * Conclude, deactivate, or delete an enrollment
   */
  async updateEnrollment(
    courseId: string,
    enrollmentId: string,
    params: EnrollmentUpdateParams
  ): Promise<Enrollment> {
    const queryParams: any = {};
    if (params.task) {
      queryParams.task = params.task;
    }

    const response = await this.canvasClient.delete(
      `/courses/${courseId}/enrollments/${enrollmentId}`,
      { params: queryParams }
    );
    return response.data;
  }

  /**
   * Accept a course invitation
   */
  async acceptEnrollment(
    params: EnrollmentAcceptRejectParams
  ): Promise<{ success: boolean }> {
    const { course_id, enrollment_id } = params;
    const response = await this.canvasClient.post(
      `/courses/${course_id}/enrollments/${enrollment_id}/accept`
    );
    return response.data;
  }

  /**
   * Reject a course invitation
   */
  async rejectEnrollment(
    params: EnrollmentAcceptRejectParams
  ): Promise<{ success: boolean }> {
    const { course_id, enrollment_id } = params;
    const response = await this.canvasClient.post(
      `/courses/${course_id}/enrollments/${enrollment_id}/reject`
    );
    return response.data;
  }

  /**
   * Reactivate an inactive enrollment
   */
  async reactivateEnrollment(
    params: EnrollmentReactivateParams
  ): Promise<Enrollment> {
    const { course_id, enrollment_id } = params;
    const response = await this.canvasClient.put(
      `/courses/${course_id}/enrollments/${enrollment_id}/reactivate`
    );
    return response.data;
  }

  /**
   * Add last attended date to student enrollment
   */
  async addLastAttendedDate(params: LastAttendedParams): Promise<Enrollment> {
    const { course_id, user_id, date } = params;
    const requestData: any = {};
    if (date) {
      requestData.date = date;
    }

    const response = await this.canvasClient.put(
      `/courses/${course_id}/users/${user_id}/last_attended`,
      requestData
    );
    return response.data;
  }

  /**
   * Show temporary enrollment recipient and provider status
   */
  async getTemporaryEnrollmentStatus(
    params: TemporaryEnrollmentStatusParams
  ): Promise<TemporaryEnrollmentStatus> {
    const { user_id, account_id } = params;
    const queryParams: any = {};
    if (account_id) {
      queryParams.account_id = account_id;
    }

    const response = await this.canvasClient.get(
      `/users/${user_id}/temporary_enrollment_status`,
      { params: queryParams }
    );
    return response.data;
  }

  /**
   * Bulk enrollment operations
   */
  async bulkCreateEnrollments(
    context: "course" | "section",
    contextId: string,
    enrollments: EnrollmentCreateParams[]
  ): Promise<Enrollment[]> {
    const results: Enrollment[] = [];

    for (const enrollment of enrollments) {
      try {
        const result = await this.createEnrollment(
          context,
          contextId,
          enrollment
        );
        results.push(result);
      } catch (error) {
        // Continue with other enrollments even if one fails
        console.error(
          `Failed to create enrollment for user ${enrollment.user_id}:`,
          error
        );
      }
    }

    return results;
  }

  /**
   * Get enrollments by user ID across all courses
   */
  async getUserEnrollments(
    userId: string,
    params: Omit<EnrollmentListParams, "user_id"> = {}
  ): Promise<Enrollment[]> {
    return this.listEnrollments("user", userId, params);
  }

  /**
   * Get enrollments for a specific course
   */
  async getCourseEnrollments(
    courseId: string,
    params: EnrollmentListParams = {}
  ): Promise<Enrollment[]> {
    return this.listEnrollments("course", courseId, params);
  }

  /**
   * Get enrollments for a specific section
   */
  async getSectionEnrollments(
    sectionId: string,
    params: EnrollmentListParams = {}
  ): Promise<Enrollment[]> {
    return this.listEnrollments("section", sectionId, params);
  }

  /**
   * Get active student enrollments for a course
   */
  async getActiveStudents(courseId: string): Promise<Enrollment[]> {
    return this.getCourseEnrollments(courseId, {
      type: ["StudentEnrollment"],
      state: ["active"],
      include: ["user"],
    });
  }

  /**
   * Get all teachers for a course
   */
  async getCourseTeachers(courseId: string): Promise<Enrollment[]> {
    return this.getCourseEnrollments(courseId, {
      type: ["TeacherEnrollment"],
      state: ["active"],
      include: ["user"],
    });
  }

  /**
   * Get pending enrollments (invitations) for a course
   */
  async getPendingEnrollments(courseId: string): Promise<Enrollment[]> {
    return this.getCourseEnrollments(courseId, {
      state: ["invited", "creation_pending"],
      include: ["user"],
    });
  }

  /**
   * Enroll multiple users as students in a course
   */
  async enrollStudents(
    courseId: string,
    userIds: string[],
    options: Partial<EnrollmentCreateParams> = {}
  ): Promise<Enrollment[]> {
    const enrollments = userIds.map((userId) => ({
      user_id: userId,
      type: "StudentEnrollment" as const,
      enrollment_state: "active" as const,
      ...options,
    }));

    return this.bulkCreateEnrollments("course", courseId, enrollments);
  }

  /**
   * Remove multiple enrollments
   */
  async removeEnrollments(
    courseId: string,
    enrollmentIds: string[],
    task: "conclude" | "delete" | "inactivate" | "deactivate" = "conclude"
  ): Promise<Enrollment[]> {
    const results: Enrollment[] = [];

    for (const enrollmentId of enrollmentIds) {
      try {
        const result = await this.updateEnrollment(courseId, enrollmentId, {
          enrollment_id: enrollmentId,
          task,
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to remove enrollment ${enrollmentId}:`, error);
      }
    }

    return results;
  }
}
