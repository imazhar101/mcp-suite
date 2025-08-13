import { Logger } from "../../../../shared/utils/logger.js";
import {
  RipplingConfig,
  RipplingServiceResponse,
  EmploymentRolesRequest,
  ListEmployeesRequest,
  Employee,
  EmploymentRole,
  DocumentFolderContentsRequest,
  ActionRequestFiltersRequest,
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

      this.logger.debug("Retrieving employment roles", {
        userId: request.userId,
      });

      const data = await this.makeRequest(
        `/employment_roles_with_company/${request.userId}/`
      );

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
      };

      this.logger.info("Employment roles retrieved successfully", {
        userId: request.userId,
        fullName: simplifiedResponse.fullName,
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

  async getCompanyLeaveTypes(): Promise<RipplingServiceResponse> {
    try {
      this.logger.debug("Retrieving company leave types");

      const data = await this.makeRequest(
        "/company_leave_types/get_sorted_company_leave_types/?includeLongTerm=true",
        {},
        "/api/pto/api"
      );

      // Filter out deleted items and simplify the response
      const filteredLeaveTypes = Array.isArray(data)
        ? data
            .filter((leaveType: any) => !leaveType.isDeleted)
            .map((leaveType: any) => ({
              leaveType: leaveType.leaveType,
              name: leaveType.name,
              description: leaveType.description,
              isUnpaid: leaveType.isUnpaid,
              country: leaveType.country,
              countrySpecificLeaveType: leaveType.countrySpecificLeaveType,
              isDeleted: leaveType.isDeleted,
            }))
        : [];

      this.logger.info("Company leave types retrieved successfully", {
        totalCount: Array.isArray(data) ? data.length : 0,
        filteredCount: filteredLeaveTypes.length,
      });

      return {
        success: true,
        data: filteredLeaveTypes,
        message: "Company leave types retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve company leave types", { error });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Company leave types not found";
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

  async getDocumentFolderContents(
    request: DocumentFolderContentsRequest
  ): Promise<RipplingServiceResponse> {
    try {
      const { parent = "root", resource } = request;

      this.logger.debug("Retrieving document folder contents", {
        parent,
        resource,
      });

      // Make request to the documents platform API
      const response = await this.makeRequest(
        `/document_tree/get_folder_contents/?parent=${encodeURIComponent(parent)}&resource=${encodeURIComponent(resource)}`,
        {},
        "/api/documents_platform/api"
      );

      this.logger.info("Document folder contents retrieved successfully", {
        parent,
        resource,
        itemCount: Array.isArray(response) ? response.length : 0,
      });

      return {
        success: true,
        data: response,
        message: "Document folder contents retrieved successfully",
      };
    } catch (error) {
      this.logger.error("Failed to retrieve document folder contents", {
        parent: request.parent,
        resource: request.resource,
        error,
      });

      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "Folder or resource not found";
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
      const requestedByRolesProvided = request.hasOwnProperty('requestedByRoles');
      
      this.logger.debug("Filter logic debug", {
        requestedByRolesProvided,
        requestedByRolesLength: requestedByRoles.length,
        pendingReviewerRolesLength: pendingReviewerRoles.length,
        userId: this.config.userId,
      });
      
      if (requestedByRolesProvided) {
        // If requestedByRoles is provided (even empty), use current user's ID to show their own requests
        const rolesToUse = requestedByRoles.length > 0 ? requestedByRoles : [this.config.userId];
        columnFilterMetadata.requested_by_roles = {
          filter_type: "IN",
          values: rolesToUse,
        };
        this.logger.debug("Using requested_by_roles filter", { values: rolesToUse });
      } else if (pendingReviewerRoles.length > 0) {
        // Handle explicit pending reviewer roles (actions to review)
        columnFilterMetadata.pending_reviewer_roles = {
          filter_type: "IN",
          values: pendingReviewerRoles,
        };
        this.logger.debug("Using pending_reviewer_roles filter (explicit)", { values: pendingReviewerRoles });
      } else {
        // Default to current user's pending reviews if no specific filter is provided
        columnFilterMetadata.pending_reviewer_roles = {
          filter_type: "IN",
          values: [this.config.userId],
        };
        this.logger.debug("Using pending_reviewer_roles filter (default)", { values: [this.config.userId] });
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

      const endpoint = `/action_request/filters/find_paginated/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

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
}
