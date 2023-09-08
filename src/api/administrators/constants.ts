export interface AdminUserProfile {
  securityId: string;
  email?: string;
  name?: string;
  [attribute: string]: any;
}
