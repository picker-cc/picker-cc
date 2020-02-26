export interface UserInfoData {
  userId: number;
  username: string;
  email: string;
  mobile: string;
  banned: boolean;
  recycle: boolean;
  createdAt: string;
  updatedAt: string;
  userRoles: Array<{
    id: number;
    name: string
  }>;
  userOrganizations: Array<{
    id: number;
    name: string;
  }>;
  userInfos: Array<{
    id: number;
    order: number;
    relationId: number;
    type: string;
    name: string;
    value: string;
    description: string;
    registerDisplay: boolean;
    informationDisplay: boolean;
  }>;
}

export interface CreateUserInput {
  username?: string;
  email?: string;
  mobile?: string;
  password: string;
  banned?: boolean;
  infoKVs?: Array<{ key: number; value: string }>;
  roleIds?: number[];
  organizationIds?: number[];
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  mobile?: string;
  password?: string;
  banned?: boolean;
  infoKVs?: Array<{
    key: number;
    value: string;
    relationId?: number
  }>;
  roleIds?: Array<{
    before: number;
    after: number;
  }>;
  organizationIds?: Array<{
    before: number;
    after: number;
  }>;
}
