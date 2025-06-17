import { AxiosInstance } from "axios";
import {
  GradeChangeEvent,
  GradeChangeByAssignmentParams,
  GradeChangeByCourseParams,
  GradeChangeByStudentParams,
  GradeChangeByGraderParams,
  GradeChangeAdvancedQueryParams,
} from "../types/grade-change-log.js";

export class GradeChangeLogService {
  constructor(private canvasClient: AxiosInstance) {}

  async queryByAssignment(
    params: GradeChangeByAssignmentParams
  ): Promise<GradeChangeEvent[]> {
    const { assignment_id, ...queryParams } = params;

    const response = await this.canvasClient.get(
      `/audit/grade_change/assignments/${assignment_id}`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async queryByCourse(
    params: GradeChangeByCourseParams
  ): Promise<GradeChangeEvent[]> {
    const { course_id, ...queryParams } = params;

    const response = await this.canvasClient.get(
      `/audit/grade_change/courses/${course_id}`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async queryByStudent(
    params: GradeChangeByStudentParams
  ): Promise<GradeChangeEvent[]> {
    const { student_id, ...queryParams } = params;

    const response = await this.canvasClient.get(
      `/audit/grade_change/students/${student_id}`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async queryByGrader(
    params: GradeChangeByGraderParams
  ): Promise<GradeChangeEvent[]> {
    const { grader_id, ...queryParams } = params;

    const response = await this.canvasClient.get(
      `/audit/grade_change/graders/${grader_id}`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async advancedQuery(
    params: GradeChangeAdvancedQueryParams
  ): Promise<GradeChangeEvent[]> {
    const response = await this.canvasClient.get(`/audit/grade_change`, {
      params,
    });
    return response.data;
  }
}
