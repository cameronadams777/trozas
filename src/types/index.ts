export interface IConnectionDetails {
  instanceUrl: string;
  apiToken: string;
}

export interface ILog {
  timestamp: Date;
  podId: string;
  value: string;
}
