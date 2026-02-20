import { IContract, ContractModel } from "../models/contract.model";

export class ContractRepository {
  async create(data: Partial<IContract>): Promise<IContract> {
    const contract = new ContractModel(data);
    return await contract.save();
  }

  async updateStatus(id: string, status: "pending" | "active" | "terminated"): Promise<IContract | null> {
    return ContractModel.findByIdAndUpdate(id, { status }, { new: true })
      .populate("memberId nurseId", "name email role");
  }

  async getContractsForMember(memberId: string): Promise<IContract[]> {
    return ContractModel.find({ memberId })
      .populate("nurseId", "name email role");
  }
}
