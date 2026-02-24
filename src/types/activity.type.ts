import { IActivity } from "../models/activity.model";

export type ActivityType = IActivity;

export interface ActivityResponse {
  success: boolean;
  data: IActivity[];
}
