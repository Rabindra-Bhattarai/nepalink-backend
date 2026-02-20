import { Request, Response } from "express";
import { ContractService } from "../services/contract.service";

const contractService = new ContractService();

export class ContractController {
  async create(req: Request, res: Response) {
    try {
      const contract = await contractService.createContract({
        memberId: (req as any).user._id,
        nurseId: req.body.nurseId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });
      return res.status(201).json({ success: true, data: contract });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async activate(req: Request, res: Response) {
  try {
    const contract = await contractService.updateStatus(req.params.id, "active");
    if (!contract) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }
    return res.json({ success: true, data: contract });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async terminate(req: Request, res: Response) {
  try {
    const contract = await contractService.updateStatus(req.params.id, "terminated");
    if (!contract) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }
    return res.json({ success: true, data: contract });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


  async getByMember(req: Request, res: Response) {
    try {
      const contracts = await contractService.getContractsForMember((req as any).user._id);
      return res.json({ success: true, data: contracts });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
