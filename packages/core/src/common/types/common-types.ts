import { PickerEntity } from '../../entity/base/base.entity';
/**
 * Entities which can be soft deleted should implement this interface.
 */
export interface SoftDeletable {
  deletedAt: Date | null;
}

/**
 * Entities which can be ordered relative to their siblings in a list.
 */
export interface Orderable {
  position: number;
}

/**
 * Creates a type based on T, but with all properties non-optional
 * and readonly.
 */
export type ReadOnlyRequired<T> = { +readonly [K in keyof T]-?: T[K] };

/**
 * Given an array type e.g. Array<string>, return the inner type e.g. string.
 */
export type UnwrappedArray<T extends any[]> = T[number];

/**
 * Parameters for list queries
 */
export interface ListQueryOptions<T extends PickerEntity> {
  take?: number | null;
  skip?: number | null;
  sort?: NullOptionals<SortParameter<T>> | null;
  filter?: NullOptionals<FilterParameter<T>> | null;
}

/**
 * Returns a type T where any optional fields also have the "null" type added.
 * This is needed to provide interop with the Apollo-generated interfaces, where
 * nullable fields have the type `field?: <type> | null`.
 */
export type NullOptionals<T> = {
  [K in keyof T]: undefined extends T[K] ? NullOptionals<T[K]> | null : NullOptionals<T[K]>
};

export type SortOrder = 'ASC' | 'DESC';

// prettier-ignore
export type PrimitiveFields<T extends PickerEntity> = {
  [K in keyof T]: T[K] extends number | string | boolean | Date ? K : never
}[keyof T];
//
// prettier-ignore
export type SortParameter<T extends PickerEntity> = {
  [K in PrimitiveFields<T>]?: SortOrder
};

// prettier-ignore
export type CustomFieldSortParameter = {
  [customField: string]: SortOrder;
};

// prettier-ignore
export type FilterParameter<T extends PickerEntity> = {
  [K in PrimitiveFields<T>]?: T[K] extends string ? StringOperators
    : T[K] extends number ? NumberOperators
      : T[K] extends boolean ? BooleanOperators
        : T[K] extends Date ? DateOperators : StringOperators;
};

export interface StringOperators {
  eq?: string;
  contains?: string;
}

export interface BooleanOperators {
  eq?: boolean;
}

export interface NumberRange {
  start: number;
  end: number;
}

export interface NumberOperators {
  eq?: number;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  between?: NumberRange;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateOperators {
  eq?: Date;
  before?: Date;
  after?: Date;
  between?: DateRange;
}
