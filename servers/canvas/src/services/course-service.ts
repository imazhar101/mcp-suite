import { AxiosInstance } from "axios";
import {
  Course,
  CourseCreateParams,
  CourseUpdateParams,
  CourseListParams,
  CourseSettings,
  CourseProgress,
} from "../types/course.js";
import {
  User,
  CourseUserListParams,
  UserProgressParams,
} from "../types/user.js";

export class CourseService {
  constructor(private canvasClient: AxiosInstance) {}

  async listCourses(params: CourseListParams = {}): Promise<Course[]> {
    const queryParams: any = {};

    if (params.enrollment_type) {
      queryParams.enrollment_type = params.enrollment_type;
    }
    if (params.enrollment_state) {
      queryParams.enrollment_state = params.enrollment_state;
    }
    if (params.state) {
      queryParams["state[]"] = params.state;
    }
    if (params.include) {
      queryParams["include[]"] = params.include;
    }

    const response = await this.canvasClient.get("/courses", {
      params: queryParams,
    });
    return response.data;
  }

  async getCourse(courseId: string, include?: string[]): Promise<Course> {
    const params: any = {};
    if (include) {
      params["include[]"] = include;
    }

    const response = await this.canvasClient.get(`/courses/${courseId}`, {
      params,
    });
    return response.data;
  }

  async createCourse(params: CourseCreateParams): Promise<Course> {
    const { account_id, ...courseData } = params;

    // Build the course object with proper nesting
    const requestData: any = {
      course: {},
    };

    // Map flat arguments to nested course object
    Object.keys(courseData).forEach((key) => {
      if (key === "offer" || key === "enroll_me") {
        requestData[key] = courseData[key as keyof typeof courseData];
      } else {
        requestData.course[key] = courseData[key as keyof typeof courseData];
      }
    });

    const response = await this.canvasClient.post(
      `/accounts/${account_id}/courses`,
      requestData
    );
    return response.data;
  }

  async updateCourse(params: CourseUpdateParams): Promise<Course> {
    const { course_id, ...courseData } = params;

    // Build the course object with proper nesting
    const requestData: any = {
      course: {},
    };

    // Map flat arguments to nested course object
    Object.keys(courseData).forEach((key) => {
      if (key === "offer") {
        requestData[key] = courseData[key as keyof typeof courseData];
      } else {
        requestData.course[key] = courseData[key as keyof typeof courseData];
      }
    });

    const response = await this.canvasClient.put(
      `/courses/${course_id}`,
      requestData
    );
    return response.data;
  }

  async deleteCourse(
    courseId: string,
    event: "delete" | "conclude"
  ): Promise<any> {
    const response = await this.canvasClient.delete(`/courses/${courseId}`, {
      params: { event },
    });
    return response.data;
  }

  async listCourseUsers(params: CourseUserListParams): Promise<User[]> {
    const { course_id, ...queryParams } = params;

    // Convert array parameters to Canvas API format
    if (queryParams.enrollment_type) {
      (queryParams as any)["enrollment_type[]"] = queryParams.enrollment_type;
      delete queryParams.enrollment_type;
    }
    if (queryParams.enrollment_state) {
      (queryParams as any)["enrollment_state[]"] = queryParams.enrollment_state;
      delete queryParams.enrollment_state;
    }
    if (queryParams.include) {
      (queryParams as any)["include[]"] = queryParams.include;
      delete queryParams.include;
    }

    const response = await this.canvasClient.get(
      `/courses/${course_id}/users`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async getCourseUser(
    courseId: string,
    userId: string,
    include?: string[]
  ): Promise<User> {
    const params: any = {};
    if (include) {
      params["include[]"] = include;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/users/${userId}`,
      { params }
    );
    return response.data;
  }

  async getUserProgress(params: UserProgressParams): Promise<CourseProgress> {
    const { course_id, user_id } = params;

    const response = await this.canvasClient.get(
      `/courses/${course_id}/users/${user_id}/progress`
    );
    return response.data;
  }

  async getCourseSettings(courseId: string): Promise<CourseSettings> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/settings`
    );
    return response.data;
  }

  async updateCourseSettings(
    courseId: string,
    settings: Partial<CourseSettings>
  ): Promise<CourseSettings> {
    const response = await this.canvasClient.put(
      `/courses/${courseId}/settings`,
      settings
    );
    return response.data;
  }
}
