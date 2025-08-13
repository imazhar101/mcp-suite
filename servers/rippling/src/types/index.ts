export interface RipplingConfig {
  token: string;
  role: string;
  company: string;
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

export interface DocumentFolderContentsRequest {
  parent?: string;
  resource: string;
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
