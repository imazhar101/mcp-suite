import { AxiosInstance } from "axios";
import {
  Assignment,
  AssignmentListParams,
  AssignmentCreateParams,
  AssignmentUpdateParams,
  AssignmentShowParams,
  AssignmentOverride,
  BulkUpdateAssignmentParams,
} from "../types/assignment.js";

export class AssignmentService {
  constructor(private canvasClient: AxiosInstance) {}

  async listAssignments(
    courseId: string,
    params: AssignmentListParams = {}
  ): Promise<Assignment[]> {
    const queryParams: any = {};

    if (params.include) {
      queryParams["include[]"] = params.include;
    }
    if (params.search_term) {
      queryParams.search_term = params.search_term;
    }
    if (params.override_assignment_dates !== undefined) {
      queryParams.override_assignment_dates = params.override_assignment_dates;
    }
    if (params.needs_grading_count_by_section !== undefined) {
      queryParams.needs_grading_count_by_section =
        params.needs_grading_count_by_section;
    }
    if (params.bucket) {
      queryParams.bucket = params.bucket;
    }
    if (params.assignment_ids) {
      queryParams["assignment_ids[]"] = params.assignment_ids;
    }
    if (params.order_by) {
      queryParams.order_by = params.order_by;
    }
    if (params.post_to_sis !== undefined) {
      queryParams.post_to_sis = params.post_to_sis;
    }
    if (params.new_quizzes !== undefined) {
      queryParams.new_quizzes = params.new_quizzes;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async getAssignment(
    courseId: string,
    assignmentId: string,
    params: AssignmentShowParams = {}
  ): Promise<Assignment> {
    const queryParams: any = {};

    if (params.include) {
      queryParams["include[]"] = params.include;
    }
    if (params.override_assignment_dates !== undefined) {
      queryParams.override_assignment_dates = params.override_assignment_dates;
    }
    if (params.needs_grading_count_by_section !== undefined) {
      queryParams.needs_grading_count_by_section =
        params.needs_grading_count_by_section;
    }
    if (params.all_dates !== undefined) {
      queryParams.all_dates = params.all_dates;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async createAssignment(
    courseId: string,
    params: AssignmentCreateParams
  ): Promise<Assignment> {
    const requestData: any = {
      assignment: {},
    };

    // Map parameters to the assignment object
    Object.keys(params).forEach((key) => {
      requestData.assignment[key] = params[key as keyof AssignmentCreateParams];
    });

    const response = await this.canvasClient.post(
      `/courses/${courseId}/assignments`,
      requestData
    );
    return response.data;
  }

  async updateAssignment(
    courseId: string,
    assignmentId: string,
    params: AssignmentUpdateParams
  ): Promise<Assignment> {
    const requestData: any = {
      assignment: {},
    };

    // Map parameters to the assignment object
    Object.keys(params).forEach((key) => {
      requestData.assignment[key] = params[key as keyof AssignmentUpdateParams];
    });

    const response = await this.canvasClient.put(
      `/courses/${courseId}/assignments/${assignmentId}`,
      requestData
    );
    return response.data;
  }

  async deleteAssignment(
    courseId: string,
    assignmentId: string
  ): Promise<Assignment> {
    const response = await this.canvasClient.delete(
      `/courses/${courseId}/assignments/${assignmentId}`
    );
    return response.data;
  }

  async duplicateAssignment(
    courseId: string,
    assignmentId: string,
    resultType?: "Quiz"
  ): Promise<Assignment> {
    const params: any = {};
    if (resultType) {
      params.result_type = resultType;
    }

    const response = await this.canvasClient.post(
      `/courses/${courseId}/assignments/${assignmentId}/duplicate`,
      {},
      { params }
    );
    return response.data;
  }

  async bulkUpdateAssignmentDates(
    courseId: string,
    assignments: BulkUpdateAssignmentParams[]
  ): Promise<any> {
    const response = await this.canvasClient.put(
      `/courses/${courseId}/assignments/bulk_update`,
      assignments
    );
    return response.data;
  }

  // Assignment Overrides
  async listAssignmentOverrides(
    courseId: string,
    assignmentId: string
  ): Promise<AssignmentOverride[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}/overrides`
    );
    return response.data;
  }

  async getAssignmentOverride(
    courseId: string,
    assignmentId: string,
    overrideId: string
  ): Promise<AssignmentOverride> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/${assignmentId}/overrides/${overrideId}`
    );
    return response.data;
  }

  async createAssignmentOverride(
    courseId: string,
    assignmentId: string,
    override: Partial<AssignmentOverride>
  ): Promise<AssignmentOverride> {
    const requestData = {
      assignment_override: override,
    };

    const response = await this.canvasClient.post(
      `/courses/${courseId}/assignments/${assignmentId}/overrides`,
      requestData
    );
    return response.data;
  }

  async updateAssignmentOverride(
    courseId: string,
    assignmentId: string,
    overrideId: string,
    override: Partial<AssignmentOverride>
  ): Promise<AssignmentOverride> {
    const requestData = {
      assignment_override: override,
    };

    const response = await this.canvasClient.put(
      `/courses/${courseId}/assignments/${assignmentId}/overrides/${overrideId}`,
      requestData
    );
    return response.data;
  }

  async deleteAssignmentOverride(
    courseId: string,
    assignmentId: string,
    overrideId: string
  ): Promise<AssignmentOverride> {
    const response = await this.canvasClient.delete(
      `/courses/${courseId}/assignments/${assignmentId}/overrides/${overrideId}`
    );
    return response.data;
  }

  async batchRetrieveOverrides(
    courseId: string,
    overrides: Array<{ id: string; assignment_id: string }>
  ): Promise<AssignmentOverride[]> {
    const params: any = {};
    overrides.forEach((override, index) => {
      params[`assignment_overrides[${index}][id]`] = override.id;
      params[`assignment_overrides[${index}][assignment_id]`] =
        override.assignment_id;
    });

    const response = await this.canvasClient.get(
      `/courses/${courseId}/assignments/overrides`,
      { params }
    );
    return response.data;
  }

  async batchCreateOverrides(
    courseId: string,
    overrides: Partial<AssignmentOverride>[]
  ): Promise<AssignmentOverride[]> {
    const requestData = {
      assignment_overrides: overrides,
    };

    const response = await this.canvasClient.post(
      `/courses/${courseId}/assignments/overrides`,
      requestData
    );
    return response.data;
  }

  async batchUpdateOverrides(
    courseId: string,
    overrides: Partial<AssignmentOverride>[]
  ): Promise<AssignmentOverride[]> {
    const requestData = {
      assignment_overrides: overrides,
    };

    const response = await this.canvasClient.put(
      `/courses/${courseId}/assignments/overrides`,
      requestData
    );
    return response.data;
  }
}
