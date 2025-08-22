import { Logger } from "../../../../shared/utils/logger.js";
import {
  RipplingConfig,
  RipplingServiceResponse,
  EmploymentRolesRequest,
  ListEmployeesRequest,
  ActionRequestFiltersRequest,
  OpenInterviewsAndFeedbacksRequest,
  UpdateFeedbackFormResponseRequest,
  GetAlertsRequest,
  TimeOffRequestsRequest,
  HolidayCalendarRequest,
  RequestTimeOffRequest,
  LeaveRequestResponse,
  CancelActionRequestRequest,
} from "../types/index.js";

export class RipplingService {
  private config: RipplingConfig;
  private logger: Logger;
  private baseUrl = "https://app.rippling.com";

  constructor(config: RipplingConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    apiPath: string = "/api/hub/api"
  ): Promise<any> {
    const url = `${this.baseUrl}${apiPath}${endpoint}`;

    const headers = {
      Authorization: `Bearer ${this.config.token}`,
      Role: this.config.role,
      Company: this.config.company,
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      this.logger.debug("Making request to Rippling API", {
        url,
        method: options.method || "GET",
      });

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error("Rippling API request failed", { url, error });
      throw error;
    }
  }

  async testConnection(): Promise<RipplingServiceResponse> {
    try {
      // Test with a simple employee list request
      const data = await this.makeRequest("/employee_list/find_paginated", {
        method: "POST",
        body: JSON.stringify({
          paginationParams: {
            page: 1,
            sortingMetadata: {
              columnIndex: 0,
              order: "ASC",
              columnId: "0",
              column: {
                search: [
                  "fullName",
                  "user_cache.name.first",
                  "user_cache.name.last",
                ],
                sort: true,
                type: "role",
                sortKey: ["user_cache.name.last", "user_cache.name.first"],
                id: "0",
              },
            },
          },
          searchQuery: "",
          empFilterMetadata: {},
          readPreference: "PRIMARY",
        }),
      });

      this.logger.info("Rippling connection successful");
      return {
        success: true,
        data: { employeeCount: data.data?.length || 0 },
        message: "Successfully connected to Rippling",
      };
    } catch (error) {
      this.logger.error("Rippling connection failed", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async getEmploymentRoles(
    request: EmploymentRolesRequest
  ): Promise<RipplingServiceResponse> {
    try {
      // Validate userId parameter
      if (!request.userId || request.userId.trim() === "") {
        throw new Error("User ID is required and cannot be empty");
      }

      this.logger.debug(
        "Retrieving employment roles with detailed field data",
        {
          userId: request.userId,
        }
      );

      // Make parallel requests for employment roles and detailed field data
      const [data, additionalInfoFields, personalInfoFields] =
        await Promise.all([
          this.makeRequest(`/employment_roles_with_company/${request.userId}/`),
          this.makeRequest("/profile/get_fields_data", {
            method: "POST",
            body: JSON.stringify({
              roleId: request.userId,
              sectionId: "additionalInformation",
              requestedFields: [],
              changedFields: {},
            }),
          }),
          this.makeRequest("/profile/get_fields_data", {
            method: "POST",
            body: JSON.stringify({
              roleId: request.userId,
              sectionId: "personal information",
              requestedFields: [],
              changedFields: {},
            }),
          }),
        ]);

      // Helper function to extract only field values from field data
      const extractFieldValues = (fieldsData: any): Record<string, any> => {
        const fieldValues: Record<string, any> = {};
        if (fieldsData?.fields) {
          Object.keys(fieldsData.fields).forEach((fieldName) => {
            const field = fieldsData.fields[fieldName];
            if (field && field.hasOwnProperty("value")) {
              fieldValues[fieldName] = field.value;
            }
          });
        }
        return fieldValues;
      };

      // Extract simplified field values
      const additionalInfo = extractFieldValues(additionalInfoFields);
      const personalInfo = extractFieldValues(personalInfoFields);

      // Transform the response to match the required format
      const simplifiedResponse = {
        fullName: data.fullName,
        title: data.title,
        departmentName: data.departmentName,
        company: data.companyTaxInfo,
        startDate: data.startDate,
        email: data.user_cache?.email,
        workEmail: data.workEmail,
        phoneNumber: data.user_cache?.phone,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhoneNumber: data.emergencyContactPhoneNumber,
        dob: data.dateOfBirth,
        manager: data.manager,
        gender: data.gender,
        pan: data.panNumber,
        uan: data.uanNumber,
        aadhaarNumber: data.aadhaarNumber,
        address: data.homeAddress
          ? {
              streetLine1: data.homeAddress.streetLine1,
              streetLine2: data.homeAddress.streetLine2,
              city: data.homeAddress.city,
              state: data.homeAddress.state,
              zip: data.homeAddress.zip,
              country: data.homeAddress.country,
              stateName: data.homeAddress.stateName,
              fullAddress: data.homeAddress.fullAddress,
            }
          : null,
        currentJob: data.currentJob
          ? {
              title: data.currentJob.title,
              salaryPerUnit: data.currentJob.salaryPerUnit,
              salaryUnit: data.currentJob.salaryUnit,
              baseSalary: data.currentJob.baseSalary,
              housingRentAllowance: data.currentJob.housingRentAllowance,
              otherTaxableAllowance: data.currentJob.otherTaxableAllowance,
              grossSalary: data.currentJob.grossSalary,
              effectiveAnnualSalary: data.currentJob.effectiveAnnualSalary,
            }
          : null,
        workLocation: data.workLocation
          ? {
              nickname: data.workLocation.nickname,
              address: {
                streetLine1: data.workLocation.address?.streetLine1,
                streetLine2: data.workLocation.address?.streetLine2,
                city: data.workLocation.address?.city,
                state: data.workLocation.address?.state,
                zip: data.workLocation.address?.zip,
                country: data.workLocation.address?.country,
                stateName: data.workLocation.address?.stateName,
                fullAddress: data.workLocation.address?.fullAddress,
              },
            }
          : null,
        photo: data.user_cache?.photo,
        // Add detailed field information
        additionalInformation: additionalInfo,
        personalInformation: personalInfo,
      };

      this.logger.info("Employment roles retrieved successfully", {
        userId: request.userId,
        fullName: simplifiedResponse.fullName,
        additionalFieldsCount: Object.keys(additionalInfo).length,
        personalFieldsCount: Object.keys(personalInfo).length,
      });

      return {
        success: true,
        data: simplifiedResponse,
        message: "Employment roles retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve employment roles", {
        userId: request.userId,
        error,
      });

      // Provide more specific error messages based on common failure scenarios
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = `User with ID '${request.userId}' not found`;
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getEligibleLeavePolicies(): Promise<RipplingServiceResponse> {
    try {
      this.logger.debug("Retrieving eligible leave policies");

      const requestBody = {
        role: this.config.userId,
        includeLongTerm: true,
        includeTerminated: false,
      };

      const data = await this.makeRequest(
        "/leave_policies/get_eligible_policies/",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        },
        "/api/pto/api"
      );

      // Helper function to strip HTML tags from description
      const stripHtml = (html: string | null | undefined): string => {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, "").trim();
      };

      // Simplify the response to only include specified fields
      const simplifiedPolicies = Array.isArray(data)
        ? data.map((policy: any) => ({
            id: policy.id,
            numHours: policy.numHours,
            customName: policy.customName,
            description: stripHtml(policy.description),
            minHoursToScheduleLeave: policy.minHoursToScheduleLeave,
            maxHoursToScheduleLeave: policy.maxHoursToScheduleLeave,
            country: policy.country,
            leaveTypeId: policy.leaveTypeId,
          }))
        : [];

      this.logger.info("Eligible leave policies retrieved successfully", {
        totalCount: simplifiedPolicies.length,
        role: this.config.userId,
      });

      return {
        success: true,
        data: simplifiedPolicies,
        message: "Eligible leave policies retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve eligible leave policies", {
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Leave policies not found";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async listEmployees(
    request: ListEmployeesRequest = {}
  ): Promise<RipplingServiceResponse> {
    try {
      const { page = 1, searchQuery = "" } = request;

      this.logger.debug("Starting paginated employee list retrieval", {
        page,
        searchQuery,
      });

      let allEmployees: any[] = [];
      let currentCursor: string | null = null;
      let currentPage = page;
      let totalCalls = 0;

      // Use while loop to fetch all employees with cursor pagination
      do {
        const paginationRequestBody = {
          paginationParams: {
            page: currentPage,
            searchQuery,
            empFilterMetadata: {},
            ...(currentCursor && { cursor: currentCursor }),
          },
          readPreference: "PRIMARY",
        };

        this.logger.debug(`Making API call ${totalCalls + 1}`, {
          page: currentPage,
          hasCursor: !!currentCursor,
        });

        const response = await this.makeRequest(
          "/employee_list/find_paginated",
          {
            method: "POST",
            body: JSON.stringify(paginationRequestBody),
          }
        );

        const employees = response.data || [];
        allEmployees.push(...employees);

        // Update cursor and page for next iteration
        currentCursor = response.cursor || null;
        currentPage++;
        totalCalls++;

        this.logger.debug(`Call ${totalCalls} completed`, {
          employeesRetrieved: employees.length,
          totalSoFar: allEmployees.length,
          hasMoreData: !!currentCursor,
        });

        // Safety break to prevent infinite loops
        if (totalCalls > 5) {
          this.logger.warn(
            "Breaking pagination loop after 5 calls to prevent infinite loop"
          );
          break;
        }
      } while (currentCursor);

      // Remove duplicates using Map based on employee ID
      const employeeMap = new Map();
      allEmployees.forEach((employee: any) => {
        if (employee.id && !employeeMap.has(employee.id)) {
          employeeMap.set(employee.id, employee);
        }
      });

      allEmployees = Array.from(employeeMap.values());

      // Simplify the response
      const simplifiedEmployees = allEmployees.map((employee: any) => ({
        id: employee.id,
        fullName: employee.fullName,
      }));

      this.logger.info("Employee list retrieved using cursor pagination", {
        page,
        searchQuery,
        totalCalls,
        totalCount: simplifiedEmployees.length,
        averagePerCall:
          totalCalls > 0
            ? Math.round(simplifiedEmployees.length / totalCalls)
            : 0,
      });

      return {
        success: true,
        data: {
          employees: simplifiedEmployees,
          page,
          searchQuery,
          source: "cursor_pagination",
        },
        message: "Employee list retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve employee list", {
        page: request.page,
        error,
      });
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async listTerminatedEmployees(
    request: ListEmployeesRequest = {}
  ): Promise<RipplingServiceResponse> {
    try {
      const { page = 1, searchQuery = "" } = request;

      const requestBody = {
        paginationParams: {
          page,
          searchQuery,
          empFilterMetadata: {},
        },
        readPreference: "PRIMARY",
      };

      this.logger.debug("Retrieving terminated employees", {
        page,
        searchQuery,
      });

      const response = await this.makeRequest(
        "/employee_list/terminated_roles/find_paginated",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      // Simplify the response to just include essential terminated employee information
      const simplifiedEmployees =
        response.data?.map((employee: any) => ({
          id: employee.id,
          fullName: employee.fullName,
          userId: employee.user_cache?.id,
          email: employee.user_cache?.email,
          firstName: employee.user_cache?.name?.first,
          lastName: employee.user_cache?.name?.last,
          title: employee.title,
          department: employee.departmentName,
          employeeNumber: employee.employeeNumber,
          startDate: employee.startDate,
          endDate: employee.endDate,
          roleState: employee.roleState,
          terminationReason: employee.terminationReason,
        })) || [];

      this.logger.info("Terminated employee list retrieved", {
        page,
        searchQuery,
        count: simplifiedEmployees.length,
      });

      return {
        success: true,
        data: {
          employees: simplifiedEmployees,
          page,
          searchQuery,
          type: "terminated",
        },
        message: "Terminated employee list retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve terminated employee list", {
        page: request.page,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Terminated employees not found";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getSignedDocuments(): Promise<RipplingServiceResponse> {
    try {
      const role = this.config.role;

      this.logger.debug("Retrieving signed documents", {
        role,
      });

      // Build query parameters
      const params = new URLSearchParams();
      params.append("role", role);

      // Add all requested fields from the API example
      const fields = [
        "archived",
        "companyDocument",
        "createdAt",
        "displayName",
        "finalPdfUrl",
        "id",
        "isAmended",
        "isConfidential",
        "isDeleted",
        "isUploadedDoc",
        "name",
        "signableCompanyDocument",
        "signableDocument",
        "signatureDate",
        "type",
        "updatedAt",
        "uploadedBy",
        "userDisplayName",
      ];

      // Add requested fields as separate parameters
      fields.forEach((field) => {
        params.append("requested_fields", field);
      });

      // Make request to the signed documents API
      const response = await this.makeRequest(
        `/signed_documents/getAllIdsAndPageSize/?${params.toString()}`,
        {},
        "/api/hub/api"
      );

      this.logger.info("Signed documents retrieved successfully", {
        role,
        documentCount: response.ids ? response.ids.length : 0,
        itemsAvailable: response.itemsAvailable,
      });

      return {
        success: true,
        data: response,
        message: "Signed documents retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve signed documents", {
        role: this.config.role,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Signed documents not found or role invalid";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getAnniversaryInformation(): Promise<RipplingServiceResponse> {
    try {
      this.logger.debug("Retrieving anniversary information");

      // Make request to the anniversary app API
      const response = await this.makeRequest(
        "/role_anniversary_email_settings/get_anniversary_information",
        {},
        "/api/anniversary_app/api"
      );

      this.logger.info("Anniversary information retrieved successfully");

      return {
        success: true,
        data: response,
        message: "Anniversary information retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve anniversary information", {
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Anniversary information not found";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getActionRequestFilters(
    request: ActionRequestFiltersRequest = {}
  ): Promise<RipplingServiceResponse> {
    try {
      const {
        pageSize = 30,
        actionTypes = [],
        pendingReviewerRoles = [],
        requestedByRoles = [],
        sortColumn = "dateRequested",
        sortOrder = "DESC",
        includeRoleDetails = true,
      } = request;

      this.logger.debug("Retrieving action request filters", {
        pageSize,
        actionTypes,
        pendingReviewerRoles,
        requestedByRoles,
        sortColumn,
        sortOrder,
        includeRoleDetails,
      });

      // Build column filter metadata
      const columnFilterMetadata: any = {};

      if (actionTypes.length > 0) {
        columnFilterMetadata.action_type = {
          filter_type: "IN",
          values: actionTypes,
        };
      }

      // Check if requestedByRoles parameter was explicitly provided (even if empty)
      const requestedByRolesProvided =
        request.hasOwnProperty("requestedByRoles");

      this.logger.debug("Filter logic debug", {
        requestedByRolesProvided,
        requestedByRolesLength: requestedByRoles.length,
        pendingReviewerRolesLength: pendingReviewerRoles.length,
        userId: this.config.userId,
      });

      if (requestedByRolesProvided) {
        // If requestedByRoles is provided (even empty), use current user's ID to show their own requests
        const rolesToUse =
          requestedByRoles.length > 0 ? requestedByRoles : [this.config.userId];
        columnFilterMetadata.requested_by_roles = {
          filter_type: "IN",
          values: rolesToUse,
        };
        this.logger.debug("Using requested_by_roles filter", {
          values: rolesToUse,
        });
      } else if (pendingReviewerRoles.length > 0) {
        // Handle explicit pending reviewer roles (actions to review)
        columnFilterMetadata.pending_reviewer_roles = {
          filter_type: "IN",
          values: pendingReviewerRoles,
        };
        this.logger.debug("Using pending_reviewer_roles filter (explicit)", {
          values: pendingReviewerRoles,
        });
      } else {
        // Default to current user's pending reviews if no specific filter is provided
        columnFilterMetadata.pending_reviewer_roles = {
          filter_type: "IN",
          values: [this.config.userId],
        };
        this.logger.debug("Using pending_reviewer_roles filter (default)", {
          values: [this.config.userId],
        });
      }

      const requestBody = {
        pageSize,
        paginationParams: {
          pageSize,
          empFilterMetadata: {},
          targetEmpFilterMetadata: {},
          columnFilterMetadata,
          sortingMetadata: {
            columnIndex: 0,
            order: sortOrder,
            columnId: sortColumn,
            column: {
              sort: true,
              id: sortColumn,
              type: "text",
              data: sortColumn,
              sortKey: sortColumn,
            },
          },
        },
        readPreference: "SECONDARY_PREFERRED",
      };

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (includeRoleDetails) {
        queryParams.append("includeRoleDetails", "true");
      }

      const endpoint = `/action_request/filters/find_paginated/${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      this.logger.debug("Final request body", {
        endpoint,
        requestBody: JSON.stringify(requestBody, null, 2),
      });

      const response = await this.makeRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      this.logger.info("Action request filters retrieved successfully", {
        pageSize,
        dataCount: response.data?.length || 0,
        visibleRowCount: response.visibleRowCount,
        cursor: response.cursor,
      });

      return {
        success: true,
        data: response,
        message: "Action request filters retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve action request filters", {
        pageSize: request.pageSize,
        actionTypes: request.actionTypes,
        pendingReviewerRoles: request.pendingReviewerRoles,
        requestedByRoles: request.requestedByRoles,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Action requests not found";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getOpenInterviewsAndFeedbacks(
    request: OpenInterviewsAndFeedbacksRequest = {}
  ): Promise<RipplingServiceResponse> {
    try {
      const { searchQuery = "", timezone = "America/Phoenix" } = request;

      this.logger.debug("Retrieving open interviews and feedbacks", {
        searchQuery,
        timezone,
      });

      // Build query parameters for interviews endpoint
      const queryParams = new URLSearchParams();
      queryParams.append("searchQuery", searchQuery);
      queryParams.append("timezone", timezone);

      const endpoint = `/feedback_form_response/get_open_interviews_and_feedbacks_for_employee?${queryParams.toString()}`;

      // Get the main interviews and feedbacks data
      const response = await this.makeRequest(
        endpoint,
        {},
        "/api/ats2_provisioning/api"
      );

      // Extract unique applicant IDs from all interview sections
      const applicantIds = new Set<string>();
      const allInterviews = [
        ...(response.todayInterviews || []),
        ...(response.pendingInterviewsAndFeedbacks || []),
        ...(response.upcomingInterviews || []),
      ];

      allInterviews.forEach((interview: any) => {
        if (interview.applicant?.id) {
          applicantIds.add(interview.applicant.id);
        }
      });

      // Fetch applicant info for each unique applicant
      const applicantInfoMap = new Map<string, any>();

      if (applicantIds.size > 0) {
        this.logger.debug("Fetching applicant info for applicants", {
          applicantCount: applicantIds.size,
          applicantIds: Array.from(applicantIds),
        });

        const applicantInfoPromises = Array.from(applicantIds).map(
          async (applicantId) => {
            const applicantQueryParams = new URLSearchParams();
            applicantQueryParams.append("applicant", applicantId);
            applicantQueryParams.append("owner", this.config.company); // Use company as fallback for owner
            applicantQueryParams.append("populate", "all");

            const applicantEndpoint = `/applicant/get_applicant_info?${applicantQueryParams.toString()}`;
            const applicantInfo = await this.makeRequest(
              applicantEndpoint,
              {},
              "/api/ats2_provisioning/api"
            );

            return { applicantId, applicantInfo };
          }
        );

        const applicantResults = await Promise.all(applicantInfoPromises);
        applicantResults.forEach(({ applicantId, applicantInfo }) => {
          if (applicantInfo?.applicant) {
            applicantInfoMap.set(applicantId, {
              owner: applicantInfo.applicant.owner,
              currentMilestone: applicantInfo.applicant.currentMilestoneName,
            });
          }
        });
      }

      // Enhance the response by adding owner and currentMilestone to each interview
      const enhanceInterview = (interview: any) => {
        if (
          interview.applicant?.id &&
          applicantInfoMap.has(interview.applicant.id)
        ) {
          const additionalInfo = applicantInfoMap.get(interview.applicant.id);
          return {
            ...interview,
            applicant: {
              ...interview.applicant,
              owner: additionalInfo?.owner,
              currentMilestone: additionalInfo?.currentMilestone,
            },
          };
        }
        return interview;
      };

      const enhancedResponse = {
        todayInterviews: (response.todayInterviews || []).map(enhanceInterview),
        pendingInterviewsAndFeedbacks: (
          response.pendingInterviewsAndFeedbacks || []
        ).map(enhanceInterview),
        upcomingInterviews: (response.upcomingInterviews || []).map(
          enhanceInterview
        ),
      };

      this.logger.info("Open interviews and feedbacks retrieved successfully", {
        searchQuery,
        timezone,
        todayInterviewsCount: enhancedResponse.todayInterviews.length,
        pendingInterviewsAndFeedbacksCount:
          enhancedResponse.pendingInterviewsAndFeedbacks.length,
        upcomingInterviewsCount: enhancedResponse.upcomingInterviews.length,
        applicantInfoFetched: applicantInfoMap.size,
      });

      return {
        success: true,
        data: enhancedResponse,
        message: "Open interviews and feedbacks retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve open interviews and feedbacks", {
        searchQuery: request.searchQuery,
        timezone: request.timezone,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Interviews and feedbacks not found";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async updateFeedbackFormResponse(
    request: UpdateFeedbackFormResponseRequest
  ): Promise<RipplingServiceResponse> {
    try {
      const { feedbackFormResponse } = request;

      // Validate that required metadata fields are provided
      const requiredFields = [
        "id",
        "role",
        "owner",
        "applicant",
        "milestone",
        "interview",
        "overallRating",
        "formResponse",
      ];

      for (const field of requiredFields) {
        if (!feedbackFormResponse[field]) {
          throw new Error(
            `Missing required field: ${field}. This field must be provided from the original feedback response.`
          );
        }
      }

      // Ensure required fields from config and defaults are included
      const enhancedFeedbackFormResponse = {
        ...feedbackFormResponse,
        // Required fields from config
        company: this.config.company,
        // Standard fields with defaults
        applicantDocument: feedbackFormResponse.applicantDocument ?? null,
        assessmentDocuments: feedbackFormResponse.assessmentDocuments ?? null,
        isDeleted: feedbackFormResponse.isDeleted ?? false,
        external_on_changes: feedbackFormResponse.external_on_changes ?? [],
        startedAt: feedbackFormResponse.startedAt ?? null,
        reminderSentAt: feedbackFormResponse.reminderSentAt ?? null,
        type: feedbackFormResponse.type || "INTERVIEW",
        feedbackFormName: feedbackFormResponse.feedbackFormName || "Default",
        feedbackFormDescription:
          feedbackFormResponse.feedbackFormDescription ?? null,
        reminderEtas: feedbackFormResponse.reminderEtas ?? [],
        _cls: feedbackFormResponse._cls || "FeedbackFormResponse",
        lock: feedbackFormResponse.lock ?? null,
        applicant_document: feedbackFormResponse.applicant_document ?? null,
        // Force status to SUBMITTED when updating feedback
        status: "SUBMITTED",
        // Force submittedBy to current user
        submittedBy: this.config.userId,
        // Set completedAt to current timestamp when submitting
        completedAt:
          feedbackFormResponse.completedAt || new Date().toISOString(),
      };

      this.logger.debug("Updating feedback form response", {
        feedbackId: enhancedFeedbackFormResponse.id,
        interviewId: enhancedFeedbackFormResponse.interview,
        overallRating: enhancedFeedbackFormResponse.overallRating,
        status: enhancedFeedbackFormResponse.status,
        company: enhancedFeedbackFormResponse.company,
        applicant: enhancedFeedbackFormResponse.applicant,
      });

      const response = await this.makeRequest(
        "/feedback_form_response/update_feedback_form_response",
        {
          method: "POST",
          body: JSON.stringify({
            feedbackFormResponse: enhancedFeedbackFormResponse,
          }),
        },
        "/api/ats2_provisioning/api"
      );

      // Simplify the response as requested
      const simplifiedResponse = {
        id: response.id,
        status: response.status,
        overallRating: response.overallRating,
        completedAt: response.completedAt,
        updatedAt: response.updatedAt,
        interview: {
          id: response.interview?.id,
          name: response.interview?.name,
          status: response.interview?.status,
        },
        applicant: response.applicant,
        jobReq: response.jobReq,
        formResponse: {
          answers: response.formResponse?.answers || [],
          comments: response.formResponse?.comments || [],
        },
      };

      this.logger.info("Feedback form response updated successfully", {
        feedbackId: response.id,
        status: response.status,
        completedAt: response.completedAt,
      });

      return {
        success: true,
        data: simplifiedResponse,
        message: "Feedback form response updated successfully",
      };
    } catch (error) {
      this.logger.error("Failed to update feedback form response", {
        feedbackId: request.feedbackFormResponse?.id,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Feedback form response not found";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getAlerts(
    request: GetAlertsRequest = {}
  ): Promise<RipplingServiceResponse> {
    try {
      const {
        readStatus = "READ_STATUS_ALL",
        pageSize = 30,
        pageToken = "",
      } = request;

      this.logger.debug("Retrieving alerts from automation system", {
        readStatus,
        pageSize,
        pageToken,
      });

      const requestBody = {
        company_id: this.config.company,
        role_id: this.config.role,
        read_status: readStatus,
        page_request: {
          page_size: pageSize,
          page_token: pageToken,
        },
      };

      const response = await this.makeRequest(
        "/automation.alerts.v1.AlertService/GetAlerts",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      // Debug: Log the raw response structure
      this.logger.debug("Raw alerts API response", {
        responseKeys: Object.keys(response || {}),
        alertsLength: response?.alert?.length || 0,
        sampleAlert: response?.alert?.[0] || null,
        fullResponse: JSON.stringify(response, null, 2),
      });

      // Simplify alerts to only include html_content renamed as alert
      const simplifiedAlerts = (response.alert || []).map((alert: any) => ({
        alert: alert.html_content || "",
        created_at: alert.created_at || "",
      }));

      this.logger.info("Alerts retrieved successfully", {
        readStatus,
        pageSize,
        alertCount: simplifiedAlerts.length,
        hasNextPage: !!response.next_page_token,
      });

      return {
        success: true,
        data: {
          alerts: simplifiedAlerts,
          nextPageToken: response.next_page_token || null,
          totalCount: response.total_count || 0,
          readStatus,
          pageSize,
        },
        message: "Alerts retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve alerts", {
        readStatus: request.readStatus,
        pageSize: request.pageSize,
        pageToken: request.pageToken,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Alerts not found";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getTimeOffRequests(
    request: TimeOffRequestsRequest = {}
  ): Promise<RipplingServiceResponse> {
    try {
      const { pageSize = 30 } = request;

      this.logger.debug("Retrieving your time off requests", {
        userId: this.config.userId,
        pageSize,
      });

      const requestBody = {
        pageSize,
        paginationParams: {
          pageSize,
          empFilterMetadata: {},
          targetEmpFilterMetadata: {},
          columnFilterMetadata: {
            action_type: {
              filter_type: "IN",
              values: ["LEAVE_REQUEST_APPROVAL"],
            },
            target_roles: {
              filter_type: "IN",
              values: [this.config.userId],
            },
          },
          sortingMetadata: {
            columnIndex: 0,
            order: "DESC",
            columnId: "dateRequested",
            column: {
              sort: true,
              id: "dateRequested",
              type: "text",
              data: "dateRequested",
              sortKey: "dateRequested",
            },
          },
        },
        readPreference: "SECONDARY_PREFERRED",
      };

      this.logger.debug("Time off requests API call", {
        endpoint: "/action_request/filters/find_paginated/",
        requestBody: JSON.stringify(requestBody, null, 2),
      });

      const response = await this.makeRequest(
        "/action_request/filters/find_paginated/?includeRoleDetails=true",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      // Simplify the response to only include essential time off request information
      const simplifiedTimeOffRequests = (response.data || []).map(
        (request: any) => ({
          id: request.id,
          dateRequested: request.dateRequested,
          status: request.status,
          decision: request.decision,
          requestType: request.requestType,
          requestSummary: {
            leavePolicy: request.requestSummary?.leavePolicy,
            roleName: request.requestSummary?.roleName,
            dates: request.requestSummary?.dates,
            startDate: request.requestSummary?.startDate,
            endDate: request.requestSummary?.endDate,
            duration: request.requestSummary?.duration,
            balanceForRole: request.requestSummary?.balanceForRole,
          },
          roleMakingRequest: request.roleMakingRequest,
          roleBeingAffected: {
            id: request.roleBeingAffectedDetails?.id,
            fullName: request.roleBeingAffectedDetails?.fullName,
            title: request.roleBeingAffectedDetails?.title,
            departmentName: request.roleBeingAffectedDetails?.departmentName,
          },
        })
      );

      this.logger.info("Time off requests retrieved successfully", {
        userId: this.config.userId,
        pageSize,
        dataCount: response.data?.length || 0,
        simplifiedCount: simplifiedTimeOffRequests.length,
        visibleRowCount: response.visibleRowCount,
      });

      return {
        success: true,
        data: {
          timeOffRequests: simplifiedTimeOffRequests,
          totalCount:
            response.visibleRowCount || simplifiedTimeOffRequests.length,
          pageSize,
        },
        message: "Your time off requests retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve time off requests", {
        pageSize: request.pageSize,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Time off requests not found";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getHolidayCalendar(
    request: HolidayCalendarRequest = {}
  ): Promise<RipplingServiceResponse> {
    try {
      const { roleId, allowTimeAdmin = false, onlyPayable = false } = request;

      // Use the provided roleId or default to the current user's role
      const targetRoleId = roleId || this.config.userId;

      this.logger.debug("Retrieving holiday calendar", {
        targetRoleId,
        allowTimeAdmin,
        onlyPayable,
      });

      const requestBody = {
        role: targetRoleId,
        allow_time_admin: allowTimeAdmin,
        only_payable: onlyPayable,
      };

      const response = await this.makeRequest(
        "/get_holiday_calendar/",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        },
        "/api/pto/api"
      );

      // Filter to only include current year
      const currentYear = new Date().getFullYear();
      const currentYearHolidays = response.filter(
        (yearData: any) => yearData.year === currentYear
      );

      this.logger.info("Holiday calendar retrieved successfully", {
        targetRoleId,
        allowTimeAdmin,
        onlyPayable,
        totalYears: response.length,
        currentYearHolidays:
          currentYearHolidays.length > 0
            ? currentYearHolidays[0]?.holidays?.length
            : 0,
      });

      return {
        success: true,
        data: {
          currentYear: currentYear,
          holidays:
            currentYearHolidays.length > 0
              ? currentYearHolidays[0].holidays
              : [],
          requestedFor: targetRoleId,
        },
        message: `Holiday calendar for ${currentYear} retrieved successfully`,
      };
    } catch (error) {
      this.logger.error("Failed to retrieve holiday calendar", {
        roleId: request.roleId,
        allowTimeAdmin: request.allowTimeAdmin,
        onlyPayable: request.onlyPayable,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Holiday calendar not found";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async requestTimeOff(
    request: RequestTimeOffRequest
  ): Promise<RipplingServiceResponse> {
    try {
      const {
        roleId,
        leavePolicy,
        startDate,
        endDate,
        reasonForLeave,
        isOpenEnded,
      } = request;

      // Use the provided roleId or default to the current user's role
      const targetRoleId = roleId || this.config.userId;

      // Validate all required fields are provided
      if (
        !leavePolicy ||
        !startDate ||
        !endDate ||
        !reasonForLeave ||
        isOpenEnded === undefined
      ) {
        throw new Error(
          "All parameters are required: leavePolicy, startDate, endDate, reasonForLeave, and isOpenEnded must be provided"
        );
      }

      this.logger.debug("Submitting time off request", {
        targetRoleId,
        leavePolicy,
        startDate,
        endDate,
        reasonForLeave,
        isOpenEnded,
      });

      const requestBody = {
        role: targetRoleId,
        leavePolicy: leavePolicy,
        startDate: startDate,
        endDate: endDate,
        isOpenEnded: isOpenEnded,
        updatedProofOfLeaves: null,
        reasonForLeave: reasonForLeave,
        proofOfLeaves: [],
        company: this.config.company,
      };

      const response = await this.makeRequest(
        "/leave_requests/",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        },
        "/api/pto/api"
      );

      this.logger.info("Time off request submitted successfully", {
        targetRoleId,
        leavePolicy,
        startDate,
        endDate,
        requestId: response.id,
        status: response.status,
        actionRequestId: response.actionRequestId,
        leaveTypeName: response.leaveTypeName,
        policyDisplayName: response.policyDisplayName,
      });

      // Return the complete response from the API with key fields highlighted
      const leaveRequest: LeaveRequestResponse = response;

      return {
        success: true,
        data: {
          // Key summary fields
          id: leaveRequest.id,
          status: leaveRequest.status,
          actionRequestId: leaveRequest.actionRequestId,
          startDate: leaveRequest.startDate,
          endDate: leaveRequest.endDate,
          reasonForLeave: leaveRequest.reasonForLeave,
          numDays: leaveRequest.numDays,
          numHours: leaveRequest.numHours,
          leaveTypeName: leaveRequest.leaveTypeName,
          policyDisplayName: leaveRequest.policyDisplayName,
          requestedByName: leaveRequest.requestedByName,
          isPaid: leaveRequest.isPaid,
          isAutoApproved: leaveRequest.isAutoApproved,
          createdAt: leaveRequest.createdAt,
          updatedAt: leaveRequest.updatedAt,

          // Complete response for advanced use cases
          fullResponse: leaveRequest,
        },
        message: `Time off request submitted successfully. Status: ${leaveRequest.status}`,
      };
    } catch (error) {
      this.logger.error("Failed to submit time off request", {
        roleId: request.roleId,
        leavePolicy: request.leavePolicy,
        startDate: request.startDate,
        endDate: request.endDate,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Leave policy not found or invalid";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. Please check your permissions and authentication";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else if (error.message.includes("400")) {
          errorMessage =
            "Bad request. Please check the date format (YYYY-MM-DD) and leave policy ID";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async cancelActionRequest(
    request: CancelActionRequestRequest
  ): Promise<RipplingServiceResponse> {
    try {
      const { actionRequestId, channel = "DASHBOARD" } = request;

      // Validate required fields
      if (!actionRequestId) {
        throw new Error("actionRequestId is required");
      }

      this.logger.debug("Canceling action request", {
        actionRequestId,
        channel,
      });

      const requestBody = {
        actionRequestId: actionRequestId,
        channel: channel,
      };

      const response = await this.makeRequest("/action_request/cancel", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      this.logger.info("Action request canceled successfully", {
        actionRequestId,
        channel,
        response,
      });

      return {
        success: true,
        data: {
          actionRequestId: actionRequestId,
          channel: channel,
          canceled: true,
          response: response,
        },
        message: "Action request canceled successfully",
      };
    } catch (error) {
      this.logger.error("Failed to cancel action request", {
        actionRequestId: request.actionRequestId,
        channel: request.channel,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Action request not found or already processed";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Access denied. You may not have permission to cancel this request";
        } else if (error.message.includes("401")) {
          errorMessage =
            "Authentication failed. Please check your token and credentials";
        } else if (error.message.includes("400")) {
          errorMessage =
            "Bad request. The action request may no longer be cancellable";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
