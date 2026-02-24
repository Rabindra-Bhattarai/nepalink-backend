import { MemberRepository } from "../repositories/member.repository";

const repo = new MemberRepository();

export class MemberService {
  async getContracts(memberId: string) {
    return repo.getContracts(memberId);
  }

  async getActivities(memberId: string) {
    return repo.getActivities(memberId);
  }

  async getAnalytics(memberId: string) {
    return repo.getAnalytics(memberId);
  }
}
