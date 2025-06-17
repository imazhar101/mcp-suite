export interface GradeChangeEventLinks {
  assignment: number;
  course: number;
  student: number;
  grader: number;
  page_view?: string;
}

export interface GradeChangeEvent {
  id: string;
  created_at: string;
  event_type: string;
  excused_after: boolean;
  excused_before: boolean;
  grade_after: string;
  grade_before: string;
  graded_anonymously: boolean | null;
  version_number: string;
  request_id: string;
  links: GradeChangeEventLinks | null;
}

export interface GradeChangeQueryParams {
  start_time?: string;
  end_time?: string;
}

export interface GradeChangeByAssignmentParams extends GradeChangeQueryParams {
  assignment_id: string;
}

export interface GradeChangeByCourseParams extends GradeChangeQueryParams {
  course_id: string;
}

export interface GradeChangeByStudentParams extends GradeChangeQueryParams {
  student_id: string;
}

export interface GradeChangeByGraderParams extends GradeChangeQueryParams {
  grader_id: string;
}

export interface GradeChangeAdvancedQueryParams extends GradeChangeQueryParams {
  course_id?: number;
  assignment_id?: number;
  student_id?: number;
  grader_id?: number;
}
