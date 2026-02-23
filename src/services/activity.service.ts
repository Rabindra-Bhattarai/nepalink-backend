import { ActivityRepository } from "../repositories/activity.repository";

const repo = new ActivityRepository();

export class ActivityService {
  async createActivity(data: any) {
    return repo.create(data);
  }

  //  New method to update full activity
  async updateActivity(id: string, updateData: any) {
    return repo.updateActivity(id, updateData);
  }

  async getActivitiesForMember(memberId: string) {
    return repo.getActivitiesForMember(memberId);
  }

  async getActivitiesForNurse(nurseId: string) {
    return repo.getActivitiesForNurse(nurseId);
  }
}
