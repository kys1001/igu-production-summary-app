export type ProductionInput = {
  productionDate: string;
  productName: string;
  productionResult: string;
  equipmentIssue: string;
  qualityIssue: string;
  deliveryIssue: string;
  materialIssue: string;
  memo: string;
};

export type ProductionSample = {
  id: string;
  label: string;
  description: string;
  data: ProductionInput;
};

export type KeyIssues = {
  equipment: string[];
  quality: string[];
  delivery: string[];
  material: string[];
};

export type DeliveryImpact = {
  summary: string;
  checkPoints: string[];
  customerNoticeNeeded: string;
};

export type QualityIssue = {
  facts: string[];
  possibleCauses: string[];
  additionalChecks: string[];
  preventionPoints: string[];
};

export type DepartmentAction = {
  department: string;
  actions: string[];
};

export type SummaryResponse = {
  productionSummary: string;
  keyIssues: KeyIssues;
  deliveryImpact: DeliveryImpact;
  qualityIssue: QualityIssue;
  departmentActions: DepartmentAction[];
  meetingAgenda: string[];
  managerBrief: string;
};

export type ApiErrorResponse = {
  message: string;
};
