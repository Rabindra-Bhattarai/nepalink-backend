import { ContractRepository } from "../repositories/contract.repository";

const repo = new ContractRepository();

export class ContractService {
  async createContract(data: any) {
    return repo.create(data);
  }

  async updateStatus(id: string, status: any) {
    return repo.updateStatus(id, status);
  }

  async requestTermination(id: string, role: "member" | "nurse") {
    return repo.requestTermination(id, role);
  }

  async confirmTermination(id: string, role: "member" | "nurse") {
    return repo.confirmTermination(id, role);
  }

  async terminateByBooking(bookingId: string) {
    return repo.terminateByBooking(bookingId);
  }

  async getContractsForMember(memberId: string) {
    return repo.getContractsForMember(memberId);
  }

  async getContractsForNurse(nurseId: string) {
    return repo.getContractsForNurse(nurseId);
  }
}
