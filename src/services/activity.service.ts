import { ActivityRepository } from "../repositories/activity.repository";

const repo = new ActivityRepository();

export class ActivityService {
  async logActivity(data: any) {
    return repo.create(data);
  }

  async getActivitiesForContract(contractId: string) {
    return repo.findByContractId(contractId);
  }
}
