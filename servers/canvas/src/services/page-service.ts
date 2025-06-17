import { AxiosInstance } from "axios";
import {
  Page,
  PageRevision,
  PageListParams,
  PageCreateParams,
  PageUpdateParams,
  PageRevisionParams,
  PageRevertParams,
} from "../types/page.js";

export class PageService {
  constructor(private canvasClient: AxiosInstance) {}

  // Course Pages
  async listCoursePages(
    courseId: string,
    params: PageListParams = {}
  ): Promise<Page[]> {
    const queryParams: any = {};

    if (params.sort) {
      queryParams.sort = params.sort;
    }
    if (params.order) {
      queryParams.order = params.order;
    }
    if (params.search_term) {
      queryParams.search_term = params.search_term;
    }
    if (params.published !== undefined) {
      queryParams.published = params.published;
    }
    if (params.include) {
      queryParams["include[]"] = params.include;
    }

    const response = await this.canvasClient.get(`/courses/${courseId}/pages`, {
      params: queryParams,
    });
    return response.data;
  }

  async getCoursePage(courseId: string, urlOrId: string): Promise<Page> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/pages/${urlOrId}`
    );
    return response.data;
  }

  async createCoursePage(
    courseId: string,
    params: PageCreateParams
  ): Promise<Page> {
    const requestData = {
      wiki_page: params,
    };

    const response = await this.canvasClient.post(
      `/courses/${courseId}/pages`,
      requestData
    );
    return response.data;
  }

  async updateCoursePage(
    courseId: string,
    urlOrId: string,
    params: PageUpdateParams
  ): Promise<Page> {
    const requestData = {
      wiki_page: params,
    };

    const response = await this.canvasClient.put(
      `/courses/${courseId}/pages/${urlOrId}`,
      requestData
    );
    return response.data;
  }

  async deleteCoursePage(courseId: string, urlOrId: string): Promise<Page> {
    const response = await this.canvasClient.delete(
      `/courses/${courseId}/pages/${urlOrId}`
    );
    return response.data;
  }

  async duplicateCoursePage(courseId: string, urlOrId: string): Promise<Page> {
    const response = await this.canvasClient.post(
      `/courses/${courseId}/pages/${urlOrId}/duplicate`
    );
    return response.data;
  }

  async getCoursePageRevisions(
    courseId: string,
    urlOrId: string
  ): Promise<PageRevision[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/pages/${urlOrId}/revisions`
    );
    return response.data;
  }

  async getCoursePageRevision(
    courseId: string,
    urlOrId: string,
    revisionId: string,
    params: PageRevisionParams = {}
  ): Promise<PageRevision> {
    const queryParams: any = {};
    if (params.summary !== undefined) {
      queryParams.summary = params.summary;
    }

    const response = await this.canvasClient.get(
      `/courses/${courseId}/pages/${urlOrId}/revisions/${revisionId}`,
      { params: queryParams }
    );
    return response.data;
  }

  async revertCoursePageToRevision(
    courseId: string,
    urlOrId: string,
    params: PageRevertParams
  ): Promise<PageRevision> {
    const response = await this.canvasClient.post(
      `/courses/${courseId}/pages/${urlOrId}/revisions/${params.revision_id}`
    );
    return response.data;
  }

  async getCourseFrontPage(courseId: string): Promise<Page> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/front_page`
    );
    return response.data;
  }

  async updateCourseFrontPage(
    courseId: string,
    params: PageUpdateParams
  ): Promise<Page> {
    const requestData = {
      wiki_page: params,
    };

    const response = await this.canvasClient.put(
      `/courses/${courseId}/front_page`,
      requestData
    );
    return response.data;
  }

  // Group Pages
  async listGroupPages(
    groupId: string,
    params: PageListParams = {}
  ): Promise<Page[]> {
    const queryParams: any = {};

    if (params.sort) {
      queryParams.sort = params.sort;
    }
    if (params.order) {
      queryParams.order = params.order;
    }
    if (params.search_term) {
      queryParams.search_term = params.search_term;
    }
    if (params.published !== undefined) {
      queryParams.published = params.published;
    }
    if (params.include) {
      queryParams["include[]"] = params.include;
    }

    const response = await this.canvasClient.get(`/groups/${groupId}/pages`, {
      params: queryParams,
    });
    return response.data;
  }

  async getGroupPage(groupId: string, urlOrId: string): Promise<Page> {
    const response = await this.canvasClient.get(
      `/groups/${groupId}/pages/${urlOrId}`
    );
    return response.data;
  }

  async createGroupPage(
    groupId: string,
    params: PageCreateParams
  ): Promise<Page> {
    const requestData = {
      wiki_page: params,
    };

    const response = await this.canvasClient.post(
      `/groups/${groupId}/pages`,
      requestData
    );
    return response.data;
  }

  async updateGroupPage(
    groupId: string,
    urlOrId: string,
    params: PageUpdateParams
  ): Promise<Page> {
    const requestData = {
      wiki_page: params,
    };

    const response = await this.canvasClient.put(
      `/groups/${groupId}/pages/${urlOrId}`,
      requestData
    );
    return response.data;
  }

  async deleteGroupPage(groupId: string, urlOrId: string): Promise<Page> {
    const response = await this.canvasClient.delete(
      `/groups/${groupId}/pages/${urlOrId}`
    );
    return response.data;
  }

  async getGroupPageRevisions(
    groupId: string,
    urlOrId: string
  ): Promise<PageRevision[]> {
    const response = await this.canvasClient.get(
      `/groups/${groupId}/pages/${urlOrId}/revisions`
    );
    return response.data;
  }

  async getGroupPageRevision(
    groupId: string,
    urlOrId: string,
    revisionId: string,
    params: PageRevisionParams = {}
  ): Promise<PageRevision> {
    const queryParams: any = {};
    if (params.summary !== undefined) {
      queryParams.summary = params.summary;
    }

    const response = await this.canvasClient.get(
      `/groups/${groupId}/pages/${urlOrId}/revisions/${revisionId}`,
      { params: queryParams }
    );
    return response.data;
  }

  async revertGroupPageToRevision(
    groupId: string,
    urlOrId: string,
    params: PageRevertParams
  ): Promise<PageRevision> {
    const response = await this.canvasClient.post(
      `/groups/${groupId}/pages/${urlOrId}/revisions/${params.revision_id}`
    );
    return response.data;
  }

  async getGroupFrontPage(groupId: string): Promise<Page> {
    const response = await this.canvasClient.get(
      `/groups/${groupId}/front_page`
    );
    return response.data;
  }

  async updateGroupFrontPage(
    groupId: string,
    params: PageUpdateParams
  ): Promise<Page> {
    const requestData = {
      wiki_page: params,
    };

    const response = await this.canvasClient.put(
      `/groups/${groupId}/front_page`,
      requestData
    );
    return response.data;
  }
}
