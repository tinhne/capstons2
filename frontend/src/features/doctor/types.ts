export interface Disease {
  diseaseId: string;
  originalId: string;
  nameEn: string;
  nameVn: string;
  descriptionEn: string;
  descriptionVn: string;
  severity: string | null;
  specialization: string | null;
  synonyms: string[];
  created_at: string;
  updated_at: string;
}
export interface Symptom {
  symptomId: string;
  originalId: string;
  nameEn: string;
  nameVn: string | null;
  descriptionEn: string | null;
  descriptionVn: string | null;
  synonym: string | null;
  frequency: string | null;
  duration: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  location: string;
}

export interface ModelPrediction {
  disease: string;
  probability: number;
}

export interface DiagnosisLog {
  id: string;
  patient: PatientInfo;
  startedAt: string;
  symptoms: Record<string, any>;
  risk_factors: Record<string, any>;
  modelPrediction?: ModelPrediction;
}
