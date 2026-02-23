import { IContract, ContractModel } from "../models/contract.model";

export class ContractRepository {
  async create(data: Partial<IContract>): Promise<IContract> {
    const contract = new ContractModel(data);
    return await contract.save();
  }

  async updateStatus(id: string, status: IContract["status"]): Promise<IContract | null> {
    return ContractModel.findByIdAndUpdate(id, { status }, { new: true })
      .populate("memberId nurseId", "name email role");
  }

  async requestTermination(id: string, role: "member" | "nurse"): Promise<IContract | null> {
    const status =
      role === "member" ? "termination_requested_by_member" : "termination_requested_by_nurse";
    return ContractModel.findByIdAndUpdate(id, { status }, { new: true })
      .populate("memberId nurseId", "name email role");
  }

  async confirmTermination(id: string, role: "member" | "nurse"): Promise<IContract | null> {
    const contract = await ContractModel.findById(id);
    if (!contract) return null;

    if (
      (role === "member" && contract.status === "termination_requested_by_nurse") ||
      (role === "nurse" && contract.status === "termination_requested_by_member")
    ) {
      contract.status = "terminated";
      await contract.save();
      return contract.populate("memberId nurseId", "name email role");
    }

    return contract; // no change if status not matching
  }

  async getContractsForMember(memberId: string): Promise<IContract[]> {
    return ContractModel.find({ memberId }).populate("nurseId", "name email role");
  }

  async getContractsForNurse(nurseId: string): Promise<IContract[]> {
    return ContractModel.find({ nurseId }).populate("memberId", "name email role");
  }

  async terminateByBooking(bookingId: string): Promise<IContract | null> {
    return ContractModel.findOneAndUpdate(
      { bookingId },
      { status: "terminated" },
      { new: true }
    ).populate("memberId nurseId", "name email role");
  }
}
