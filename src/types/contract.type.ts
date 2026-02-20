import { IContract } from "../models/contract.model";

export type ContractType = IContract;

export interface ContractResponse {
  success: boolean;
  data: IContract[];
}
