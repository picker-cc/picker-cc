// tslint:disable:no-shadowed-variable
// prettier-ignore
import {ObjectId} from 'mongodb';

/**
 * A recursive implementation of the Partial<T> type.
 * Source: https://stackoverflow.com/a/49936686/772859
 */
export type DeepPartial<T> = {
  [P in keyof T]?: null | (T[P] extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>)
};
// tslint:enable:no-shadowed-variable

/**
 * A type representing the type rather than instance of a class.
 */
export type Type<T> = new (...args: any[]) => T;

/**
 * A type describing the shape of a paginated list response
 */
export interface PaginatedList<T> {
  items: T[];
  totalItems: number;
}

/**
 * @description
 * An entity ID. Depending on the configured {@link EntityIdStrategy}, it will be either
 * a `string` or a `number`;
 *
 * @docsCategory entities
 * @docsWeight 0
 */
export type ID = string;

/**
 * @description
 * A data type for a custom field.
 *
 * @docsCategory custom-fields
 */
export type CustomFieldType = 'string' | 'localeString' | 'int' | 'float' | 'boolean' | 'datetime';

/**
 * @description
 * Configures a custom field on an entity in the {@link CustomFields} config object.
 *
 * @docsCategory custom-fields
 */
export interface CustomFieldConfig {
  name: string;
  type: CustomFieldType;
}

/**
 * @description
 * Most entities can have additional fields added to them by defining an array of {@link CustomFieldConfig}
 * objects on against the corresponding key.
 *
 * @example
 * ```TypeScript
 * bootstrap({
 *     // ...
 *     customFields: {
 *         Product: [
 *             { name: 'infoUrl', type: 'string' },
 *             { name: 'downloadable', type: 'boolean' },
 *             { name: 'shortName', type: 'localeString' },
 *         ],
 *         User: [
 *             { name: 'socialLoginToken', type: 'string' },
 *         ],
 *     },
 * })
 * ```
 *
 * @docsCategory custom-fields
 */
export interface CustomFields {
  Address?: CustomFieldConfig[];
  Collection?: CustomFieldConfig[];
  Customer?: CustomFieldConfig[];
  Facet?: CustomFieldConfig[];
  FacetValue?: CustomFieldConfig[];
  GlobalSettings?: CustomFieldConfig[];
  Product?: CustomFieldConfig[];
  ProductOption?: CustomFieldConfig[];
  ProductOptionGroup?: CustomFieldConfig[];
  ProductVariant?: CustomFieldConfig[];
  User?: CustomFieldConfig[];
}

/**
 * This interface should be implemented by any entity which can be extended
 * with custom fields.
 */
export interface HasCustomFields {
  customFields: CustomFieldsObject;
}

export type MayHaveCustomFields = Partial<HasCustomFields>;

export interface CustomFieldsObject {
  [key: string]: any;
}

/**
 * This interface describes the shape of the JSON config file used by the Admin UI.
 */
export interface AdminUiConfig {
  apiHost: string | 'auto';
  apiPort: number | 'auto';
  adminApiPath: string;
  tokenMethod: 'cookie' | 'bearer';
  authTokenHeaderKey: string;
}


/**
 * @description
 * Defines extensions to the Admin UI application by specifying additional
 * Angular [NgModules](https://angular.io/guide/ngmodules) which are compiled
 * into the application.
 *
 * See [Extending the Admin UI](/docs/developer-guide/plugins/extending-the-admin-ui/) for
 * detailed instructions.
 *
 * @docsCategory AdminUiPlugin
 */
export interface AdminUiExtension {
  /**
   * @description
   * An optional ID for the extension module. Only used internally for generating
   * import paths to your module. If not specified, a unique hash will be used as the id.
   */
  id?: string;

  /**
   * @description
   * The path to the directory containing the extension module(s). The entire contents of this directory
   * will be copied into the Admin UI app, including all TypeScript source files, html templates,
   * scss style sheets etc.
   */
  extensionPath: string;
  /**
   * @description
   * One or more Angular modules which extend the default Admin UI.
   */
  ngModules: AdminUiExtensionModule[];

  /**
   * @description
   * Optional array of paths to static assets which will be copied over to the Admin UI app's `/static`
   * directory.
   */
  staticAssets?: string[];
}

/**
 * @description
 * Configuration defining a single NgModule with which to extend the Admin UI.
 *
 * @docsCategory AdminUiPlugin
 */
export interface AdminUiExtensionModule {
  /**
   * @description
   * Lazy modules are lazy-loaded at the `/extensions/` route and should be used for
   * modules which define new views for the Admin UI.
   *
   * Shared modules are directly imported into the main AppModule of the Admin UI
   * and should be used to declare custom form components and define custom
   * navigation items.
   */
  type: 'shared' | 'lazy';
  /**
   * @description
   * The name of the file containing the extension module class.
   */
  ngModuleFileName: string;
  /**
   * @description
   * The name of the extension module class.
   */
  ngModuleName: string;
}
