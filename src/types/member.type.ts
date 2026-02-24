import { IContract } from "../models/contract.model";
import { IActivity } from "../models/activity.model";

export interface MemberContractsResponse {
  success: boolean;
  data: IContract[];
}

export interface MemberActivitiesResponse {
  success: boolean;
  data: IActivity[];
}

export interface MemberAnalyticsResponse {
  success: boolean;
  data: {
    totalContracts: number;
    activeContracts: number;
    terminatedContracts: number;
    totalActivities: number;
    avgActivitiesPerContract: number;
  };
}
