import mongoose, { Document, Schema } from "mongoose";

const ActivitySchema = new Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    nurseId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },

    //  Vital Signs
    vitalSigns: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      spo2: Number,
    },

    //  Daily Care (ADLs)
    dailyCare: {
      meals: String,
      hydration: String,
      hygiene: String,
      mobility: String,
      sleepQuality: String,
    },

    //  Medical Tracking
    medicalTracking: {
      medication: String,
      painLevel: Number,
      woundCondition: String,
      bowelBladder: String,
    },

    //  Collaboration
    collaboration: {
      suppliesInventory: String,
      shiftSummary: String,
      parentInstructions: String,
      significantEvents: String,
    },

    //  Safety & Verification
    safetyVerification: {
      equipmentCheck: String,
      emergencyContactSync: Boolean,
      jointSignature: Boolean,
    },
  },
  { timestamps: true }
);

export interface IActivity extends Document {
  memberId: mongoose.Types.ObjectId;
  nurseId: mongoose.Types.ObjectId;
  description: string;
  date: Date;
  status: "pending" | "completed" | "cancelled";

  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    spo2?: number;
  };

  dailyCare?: {
    meals?: string;
    hydration?: string;
    hygiene?: string;
    mobility?: string;
    sleepQuality?: string;
  };

  medicalTracking?: {
    medication?: string;
    painLevel?: number;
    woundCondition?: string;
    bowelBladder?: string;
  };

  collaboration?: {
    suppliesInventory?: string;
    shiftSummary?: string;
    parentInstructions?: string;
    significantEvents?: string;
  };

  safetyVerification?: {
    equipmentCheck?: string;
    emergencyContactSync?: boolean;
    jointSignature?: boolean;
  };

  createdAt: Date;
  updatedAt: Date;
}

export const ActivityModel = mongoose.model<IActivity>("Activity", ActivitySchema);
