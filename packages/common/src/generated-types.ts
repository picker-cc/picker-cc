import {Property} from 'mikro-orm';

export type Maybe<T> = T | null;
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number,
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
   */
  DateTime: any,
  // tslint:disable-next-line:max-line-length
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any,
  /** The `Upload` scalar type represents a file upload. */
  Upload: any,
}

/** "
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 *
 * @docsCategory common
 */
export enum Permission {
  /**  The Authenticated role means simply that the user is logged in  */
  Authenticated = 'Authenticated',
  /**  SuperAdmin can perform the most sensitive tasks */
  SuperAdmin = 'SuperAdmin',
  /**  Owner means the user owns this entity, e.g. a Customer's own Order */
  Owner = 'Owner',
  /**  Public means any unauthenticated user may perform the operation  */
  Public = 'Public',
  CreateCatalog = 'CreateCatalog',
  ReadCatalog = 'ReadCatalog',
  UpdateCatalog = 'UpdateCatalog',
  DeleteCatalog = 'DeleteCatalog',
  CreateCustomer = 'CreateCustomer',
  ReadCustomer = 'ReadCustomer',
  UpdateCustomer = 'UpdateCustomer',
  DeleteCustomer = 'DeleteCustomer',
  CreateAdministrator = 'CreateAdministrator',
  ReadAdministrator = 'ReadAdministrator',
  UpdateAdministrator = 'UpdateAdministrator',
  DeleteAdministrator = 'DeleteAdministrator',
  CreateOrder = 'CreateOrder',
  ReadOrder = 'ReadOrder',
  UpdateOrder = 'UpdateOrder',
  DeleteOrder = 'DeleteOrder',
  CreatePromotion = 'CreatePromotion',
  ReadPromotion = 'ReadPromotion',
  UpdatePromotion = 'UpdatePromotion',
  DeletePromotion = 'DeletePromotion',
  CreateSettings = 'CreateSettings',
  ReadSettings = 'ReadSettings',
  UpdateSettings = 'UpdateSettings',
  DeleteSettings = 'DeleteSettings'
}
export type Node = {
  __typename?: 'Node',
  id: Scalars['ID'],
};

export type NumberOperators = {
  eq?: Maybe<Scalars['Float']>,
  lt?: Maybe<Scalars['Float']>,
  lte?: Maybe<Scalars['Float']>,
  gt?: Maybe<Scalars['Float']>,
  gte?: Maybe<Scalars['Float']>,
  between?: Maybe<NumberRange>,
};

export type NumberRange = {
  start: Scalars['Float'],
  end: Scalars['Float'],
};
export type CurrentUser = {
  __typename?: 'CurrentUser',
  id: Scalars['ID'],
  identifier: Scalars['String'],
}

export type LoginResult = {
  __typename?: 'LoginResult',
  user: CurrentUser,
}

export type UpdateGlobalSettingsInput = {
  // availableLanguages?: Maybe<Array<LanguageCode>>,
  trackInventory?: Maybe<Scalars['Boolean']>,
  customFields?: Maybe<Scalars['JSON']>,
};


export type MutationUpdateGlobalSettingsArgs = {
  input: UpdateGlobalSettingsInput
};


export type MutationLoginArgs = {
  username: Scalars['String'],
  password: Scalars['String'],
  rememberMe?: Maybe<Scalars['Boolean']>
}

export type RegisterCreatorInput = {
  emailAddress: Scalars['String'],
  username: Scalars['String'],
  password?: Maybe<Scalars['String']>
}

export type MutationRegisterCreatorAccountArgs = {
  input: RegisterCreatorInput
}

export type ConfigArg = {
  __typename?: 'ConfigArg',
  name: Scalars['String'],
  type: Scalars['String'],
  value: Scalars['String'],
};

export type ConfigArgDefinition = {
  __typename?: 'ConfigArgDefinition',
  name: Scalars['String'],
  type: Scalars['String'],
  label?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  config?: Maybe<Scalars['JSON']>,
};

export type ConfigArgInput = {
  name: Scalars['String'],
  type: Scalars['String'],
  value: Scalars['String'],
};

export type ConfigurableOperation = {
  __typename?: 'ConfigurableOperation',
  code: Scalars['String'],
  args: ConfigArg[],
};

export type ConfigurableOperationDefinition = {
  __typename?: 'ConfigurableOperationDefinition',
  code: Scalars['String'],
  args: ConfigArgDefinition[],
  description: Scalars['String'],
};

export type ConfigurableOperationInput = {
  code: Scalars['String'],
  arguments: ConfigArgInput[],
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}
export type BooleanOperators = {
  eq?: Maybe<Scalars['Boolean']>,
};

/// Create inputs
export type MutationCreatePostArgs = {
  input: CreatePostInput
}

export type CreatePostInput = {
  title: Scalars['String'],
  guid: Scalars['String'],
  // guid?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
}
export type DateOperators = {
  eq?: Maybe<Scalars['DateTime']>,
  before?: Maybe<Scalars['DateTime']>,
  after?: Maybe<Scalars['DateTime']>,
  between?: Maybe<DateRange>,
};
export type DateRange = {
  start: Scalars['DateTime'],
  end: Scalars['DateTime'],
};

export type PostSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  slug?: Maybe<SortOrder>,
  description?: Maybe<SortOrder>,
}
export type PostListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<PostSortParameter>,
  filter?: Maybe<PostFilterParameter>,
};
export type StringOperators = {
  eq?: Maybe<Scalars['String']>,
  contains?: Maybe<Scalars['String']>,
};


export type PostFilterParameter = {
  enabled?: Maybe<BooleanOperators>,
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  languageCode?: Maybe<StringOperators>,
  name?: Maybe<StringOperators>,
  slug?: Maybe<StringOperators>,
  description?: Maybe<StringOperators>,
};


export type QueryPostsArgs = {
  options?: Maybe<PostListOptions>
};


export type MutationCreateAssetsArgs = {
  input: CreateAssetInput[]
};


export type MutationUpdateAssetArgs = {
  input: UpdateAssetInput
};


export type CreateAssetInput = {
  file: Scalars['Upload'],
};
export type UpdateAssetInput = {
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  focalPoint?: Maybe<CoordinateInput>,
};

export type Coordinate = {
  __typename?: 'Coordinate',
  x: Scalars['Float'],
  y: Scalars['Float'],
};

export type CoordinateInput = {
  x: Scalars['Float'],
  y: Scalars['Float'],
};


export type QueryAssetsArgs = {
  options?: Maybe<AssetListOptions>
};


export type QueryAssetArgs = {
  id: Scalars['ID']
};


export type Asset = Node & {
  __typename?: 'Asset',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  name: Scalars['String'],
  type: AssetType,
  fileSize: Scalars['Int'],
  mimeType: Scalars['String'],
  width: Scalars['Int'],
  height: Scalars['Int'],
  source: Scalars['String'],
  preview: Scalars['String'],
  focalPoint?: Maybe<Coordinate>,
};
export type PaginatedList = {
  __typename?: 'PaginatedList',
  items: Node[],
  totalItems: Scalars['Int'],
};

export type AssetFilterParameter = {
  createdAt?: Maybe<DateOperators>,
  updatedAt?: Maybe<DateOperators>,
  name?: Maybe<StringOperators>,
  type?: Maybe<StringOperators>,
  fileSize?: Maybe<NumberOperators>,
  mimeType?: Maybe<StringOperators>,
  width?: Maybe<NumberOperators>,
  height?: Maybe<NumberOperators>,
  source?: Maybe<StringOperators>,
  preview?: Maybe<StringOperators>,
};

export type AssetList = PaginatedList & {
  __typename?: 'AssetList',
  items: Asset[],
  totalItems: Scalars['Int'],
};

export type AssetListOptions = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  sort?: Maybe<AssetSortParameter>,
  filter?: Maybe<AssetFilterParameter>,
};

export type AssetSortParameter = {
  id?: Maybe<SortOrder>,
  createdAt?: Maybe<SortOrder>,
  updatedAt?: Maybe<SortOrder>,
  name?: Maybe<SortOrder>,
  fileSize?: Maybe<SortOrder>,
  mimeType?: Maybe<SortOrder>,
  width?: Maybe<SortOrder>,
  height?: Maybe<SortOrder>,
  source?: Maybe<SortOrder>,
  preview?: Maybe<SortOrder>,
};

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  BINARY = 'BINARY'
}
