import { ContractModel } from "../models/contract.model";
import { ActivityModel } from "../models/activity.model";

export class MemberRepository {
  async getContracts(memberId: string) {
    return ContractModel.find({ memberId })
      .populate("nurseId", "_id name email role");
  }

  async getActivities(memberId: string) {
    const contractIds = await ContractModel.find({ memberId }).distinct("_id");
    return ActivityModel.find({ contractId: { $in: contractIds } })
      .populate("nurseId", "_id name email role")
      .populate("contractId");
  }

  async getAnalytics(memberId: string) {
    const totalContracts = await ContractModel.countDocuments({ memberId });
    const activeContracts = await ContractModel.countDocuments({ memberId, status: "active" });
    const terminatedContracts = await ContractModel.countDocuments({ memberId, status: "terminated" });

    const contractIds = await ContractModel.find({ memberId }).distinct("_id");
    const totalActivities = await ActivityModel.countDocuments({ contractId: { $in: contractIds } });

    const avgActivitiesPerContract = totalContracts > 0 ? totalActivities / totalContracts : 0;

    return {
      totalContracts,
      activeContracts,
      terminatedContracts,
      totalActivities,
      avgActivitiesPerContract,
    };
  }
}
