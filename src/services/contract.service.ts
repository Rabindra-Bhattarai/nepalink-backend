import { ContractRepository } from "../repositories/contract.repository";

const repo = new ContractRepository();

export class ContractService {
  async createContract(data: any) {
    return repo.create(data);
  }

  async updateStatus(id: string, status: "pending" | "active" | "terminated") {
    return repo.updateStatus(id, status);
  }

  async getContractsForMember(memberId: string) {
    return repo.getContractsForMember(memberId);
  }
}
