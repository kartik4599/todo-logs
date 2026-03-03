export interface TasksState {
  incompletePrevious: string[];
  newTasks: string[];
  activitiesPerformed: string[];
  incompleteEndOfDay: string[];
}

export interface EmailConfig {
  from: string;
  to: string;
  cc: string[];
}

export interface StaticInfo {
  name: string;
  designation: string;
  empCode: string;
  projectName: string;
  crmPmRmName: string;
  parallelReportingTo: string;
  startTime: string;
  leavingTime: string;
}

export interface DsrPreferences {
  cc: string[];
  reportDate: string; // ISO date string
  name: string;
  designation: string;
  empCode: string;
  projectName: string;
  crmPmRmName: string;
  startTime: string;
  leavingTime: string;
}
