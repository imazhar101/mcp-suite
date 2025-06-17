import { AxiosInstance } from "axios";
import {
  Module,
  ModuleItem,
  ModuleItemSequence,
  ModuleAssignmentOverride,
  ModuleListParams,
  ModuleShowParams,
  ModuleCreateParams,
  ModuleUpdateParams,
  ModuleItemListParams,
  ModuleItemShowParams,
  ModuleItemCreateParams,
  ModuleItemUpdateParams,
  ModuleItemSequenceParams,
  MasteryPathSelectParams,
  ModuleOverrideUpdateParams,
} from "../types/module.js";

export class ModuleService {
  constructor(private canvasClient: AxiosInstance) {}

  // Module Management
  async listModules(
    courseId: string,
    params?: ModuleListParams
  ): Promise<Module[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/modules`,
      {
        params,
      }
    );
    return response.data;
  }

  async getModule(
    courseId: string,
    moduleId: string,
    params?: ModuleShowParams
  ): Promise<Module> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/modules/${moduleId}`,
      {
        params,
      }
    );
    return response.data;
  }

  async createModule(
    courseId: string,
    moduleData: ModuleCreateParams
  ): Promise<Module> {
    const response = await this.canvasClient.post(
      `/courses/${courseId}/modules`,
      {
        module: moduleData,
      }
    );
    return response.data;
  }

  async updateModule(
    courseId: string,
    moduleId: string,
    moduleData: ModuleUpdateParams
  ): Promise<Module> {
    const response = await this.canvasClient.put(
      `/courses/${courseId}/modules/${moduleId}`,
      {
        module: moduleData,
      }
    );
    return response.data;
  }

  async deleteModule(courseId: string, moduleId: string): Promise<Module> {
    const response = await this.canvasClient.delete(
      `/courses/${courseId}/modules/${moduleId}`
    );
    return response.data;
  }

  async relockModule(courseId: string, moduleId: string): Promise<Module> {
    const response = await this.canvasClient.put(
      `/courses/${courseId}/modules/${moduleId}/relock`
    );
    return response.data;
  }

  // Module Item Management
  async listModuleItems(
    courseId: string,
    moduleId: string,
    params?: ModuleItemListParams
  ): Promise<ModuleItem[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/modules/${moduleId}/items`,
      {
        params,
      }
    );
    return response.data;
  }

  async getModuleItem(
    courseId: string,
    moduleId: string,
    itemId: string,
    params?: ModuleItemShowParams
  ): Promise<ModuleItem> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/modules/${moduleId}/items/${itemId}`,
      {
        params,
      }
    );
    return response.data;
  }

  async createModuleItem(
    courseId: string,
    moduleId: string,
    itemData: ModuleItemCreateParams
  ): Promise<ModuleItem> {
    const response = await this.canvasClient.post(
      `/courses/${courseId}/modules/${moduleId}/items`,
      {
        module_item: itemData,
      }
    );
    return response.data;
  }

  async updateModuleItem(
    courseId: string,
    moduleId: string,
    itemId: string,
    itemData: ModuleItemUpdateParams
  ): Promise<ModuleItem> {
    const response = await this.canvasClient.put(
      `/courses/${courseId}/modules/${moduleId}/items/${itemId}`,
      {
        module_item: itemData,
      }
    );
    return response.data;
  }

  async deleteModuleItem(
    courseId: string,
    moduleId: string,
    itemId: string
  ): Promise<ModuleItem> {
    const response = await this.canvasClient.delete(
      `/courses/${courseId}/modules/${moduleId}/items/${itemId}`
    );
    return response.data;
  }

  async selectMasteryPath(
    courseId: string,
    moduleId: string,
    itemId: string,
    params: MasteryPathSelectParams
  ): Promise<any> {
    const response = await this.canvasClient.post(
      `/courses/${courseId}/modules/${moduleId}/items/${itemId}/select_mastery_path`,
      params
    );
    return response.data;
  }

  async markModuleItemAsDone(
    courseId: string,
    moduleId: string,
    itemId: string
  ): Promise<void> {
    await this.canvasClient.put(
      `/courses/${courseId}/modules/${moduleId}/items/${itemId}/done`
    );
  }

  async markModuleItemAsNotDone(
    courseId: string,
    moduleId: string,
    itemId: string
  ): Promise<void> {
    await this.canvasClient.delete(
      `/courses/${courseId}/modules/${moduleId}/items/${itemId}/done`
    );
  }

  async getModuleItemSequence(
    courseId: string,
    params: ModuleItemSequenceParams
  ): Promise<ModuleItemSequence> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/module_item_sequence`,
      {
        params,
      }
    );
    return response.data;
  }

  async markModuleItemRead(
    courseId: string,
    moduleId: string,
    itemId: string
  ): Promise<void> {
    await this.canvasClient.post(
      `/courses/${courseId}/modules/${moduleId}/items/${itemId}/mark_read`
    );
  }

  // Module Assignment Overrides
  async listModuleOverrides(
    courseId: string,
    moduleId: string
  ): Promise<ModuleAssignmentOverride[]> {
    const response = await this.canvasClient.get(
      `/courses/${courseId}/modules/${moduleId}/assignment_overrides`
    );
    return response.data;
  }

  async updateModuleOverrides(
    courseId: string,
    moduleId: string,
    overrideData: ModuleOverrideUpdateParams
  ): Promise<void> {
    await this.canvasClient.put(
      `/courses/${courseId}/modules/${moduleId}/assignment_overrides`,
      overrideData
    );
  }
}
