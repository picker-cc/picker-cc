export interface RoleInfoData {
  id: number;
  name: string;
  permissions: Array<{
    id: number;
    name: string;
    action: string;
    identify: string;
  }>;
  infoItems: Array<{
    id: number;
    name: string;
    description: string;
    type: string;
  }>;
}
