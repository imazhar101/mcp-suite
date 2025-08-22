export interface RipplingConfig {
  token: string;
  role: string;
  company: string;
  userId: string;
}

export interface RipplingServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface EmploymentRolesRequest {
  userId: string;
}

export interface ListEmployeesRequest {
  page?: number;
  searchQuery?: string;
}

export interface ActionRequestFiltersRequest {
  pageSize?: number;
  actionTypes?: string[];
  pendingReviewerRoles?: string[];
  requestedByRoles?: string[];
  sortColumn?: string;
  sortOrder?: "ASC" | "DESC";
  includeRoleDetails?: boolean;
}

export interface OpenInterviewsAndFeedbacksRequest {
  searchQuery?: string;
  timezone?: string;
}

export interface UpdateFeedbackFormResponseRequest {
  feedbackFormResponse: {
    // Required core fields
    id: string;
    role: string;
    submittedBy: string;
    interview: string;
    applicant: string;
    overallRating: number;
    status: string;
    formResponse: {
      answers: Array<{
        questionKey: string;
        value: any;
        sectionKey?: string;
      }>;
      comments: Array<{
        questionKey: string;
        createdAt: string;
        anonymous: boolean;
        text: string | null;
        author: string | null;
      }>;
    };
    // Required reference fields (must be provided from original feedback)
    owner: string;
    milestone: string;
    // Optional fields with defaults
    type?: string;

    [key: string]: any; // Allow additional properties from the full object
  };
}

export interface GetAlertsRequest {
  readStatus?: "READ_STATUS_ALL" | "READ_STATUS_READ" | "READ_STATUS_UNREAD";
  pageSize?: number;
  pageToken?: string;
}

export interface TimeOffRequestsRequest {
  pageSize?: number;
}

export interface HolidayCalendarRequest {
  roleId?: string;
  allowTimeAdmin?: boolean;
  onlyPayable?: boolean;
}

export interface RequestTimeOffRequest {
  roleId?: string;
  leavePolicy: string;
  startDate: string;
  endDate: string;
  reasonForLeave: string;
  isOpenEnded: boolean;
}

export interface LeaveRequestResponse {
  id: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  reasonForLeave: string;
  status: string;
  processedAt: string | null;
  comments: string | null;
  numMinutes: string;
  role: string;
  startDateStartTime: string | null;
  endDateStartTime: string | null;
  startDateCustomHours: number;
  endDateCustomHours: number;
  leavePolicy: string;
  companyLeaveType: string;
  requestedBy: string;
  processedBy: string | null;
  leaveType: string;
  leaveTypeUniqueId: string;
  numHours: string;
  policyDisplayName: string;
  processedByName: string | null;
  requestedByName: string;
  externalId: string | null;
  partialDays: any[];
  isPaid: boolean;
  managedBy: string | null;
  finalizedStatus: string | null;
  tag: string | null;
  actionRequestId: string;
  leaveOccurrence: string | null;
  validate_before_save: boolean;
  skipValidation: boolean;
  startDateHalfDay: boolean;
  endDateHalfDay: boolean;
  startDateMinutes: string;
  endDateMinutes: string;
  numDays: string;
  numWeeks: string;
  isAutoApproved: boolean;
  spokeLeaveRequest: string | null;
  covidSickType: string | null;
  paySource: string | null;
  originalLeavePolicy: string | null;
  originalCompanyLeaveType: string | null;
  hours_by_company_leave_type_id: Record<string, number>;
  longTermLeaveStatus: string | null;
  occurrenceEndDate: string | null;
  occurrenceStartDate: string | null;
  occurrenceBased: boolean;
  isOpenEnded: boolean;
  leaveRequestAttachments: any[];
  policyAccrueInDays: boolean;
  accountingBasis: string;
  leaveTypeName: string;
  proofOfLeaves: any[];
  isFirstInOccurrenceAndSeq: boolean;
  countrySpecificDetails: any;
}

export interface CancelActionRequestRequest {
  actionRequestId: string;
  channel?: string;
}

export interface Employee {
  id: string;
  fullName: string;
  user_cache: {
    id: string;
    email: string;
    name: {
      first: string;
      last: string;
      full: string;
    };
  };
}

export interface EmploymentRole {
  id: string;
  fullName: string;
  roleState: string;
  title: string;
  departmentName: string;
  startDate: string;
  workEmail: string;
  isAdmin: boolean;
  isEmployee: boolean;
  isManager: boolean;
  user_cache: {
    id: string;
    name: {
      first: string;
      last: string;
      full: string;
      initials: string;
    };
    preferredName: string;
    preferredFirstName: string;
    signableName: string;
  };
  currentJob: {
    id: string;
    title: string;
    flsaExempt: boolean;
    isContractor: boolean;
  };
  companyEmploymentType: {
    id: string;
    displayName: string;
    label: string;
    isSalaried: boolean;
    isFullTime: boolean;
    isPartTime: boolean;
  };
  workLocation: {
    id: string;
    nickname: string;
    address: {
      fullAddress: string;
      city: string;
      state: string;
      country: string;
      timezone: string;
    };
    isRemote: boolean;
  };
}
