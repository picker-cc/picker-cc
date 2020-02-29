import {Injectable} from '@nestjs/common';
import {ID, Type} from '@picker-cc/common/lib/shared-types';
import {EntityManager, FindOneOptions, FindOptions, QueryBuilder} from 'mikro-orm';

import {ListQueryOptions} from '../../../common/types/common-types';
import {PickerEntity} from '../../../entity/base/base.entity';
// import { Connection, FindConditions, FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';
// import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';


// import {parseChannelParam} from './parse-channel-param';
// import {parseFilterParams} from './parse-filter-params';
// import {parseSortParams} from './parse-sort-params';

export type ExtendedListQueryOptions<T extends PickerEntity> = {
  relations?: string[];
  channelId?: ID;
  where?: FindOptions;
  orderBy?: FindOneOptions;
};

@Injectable()
export class ListQueryBuilder {
  constructor(private connection: EntityManager) {
  }

  /**
   * Creates and configures a SelectQueryBuilder for queries that return paginated lists of entities.
   */
  build<T extends PickerEntity>(
    entity: Type<T>,
    options: ListQueryOptions<T> = {},
    extendedOptions: ExtendedListQueryOptions<T> = {},
  ) {
    const skip = options.skip;
    let take = options.take;
    if (options.skip !== undefined && options.take === undefined) {
      take = Number.MAX_SAFE_INTEGER;
    }
    // const sort = parseSortParams(
    //   this.connection,
    //   entity,
    //   Object.assign({}, options.sort, extendedOptions.orderBy),
    // );
    // const filter = parseFilterParams(this.connection, entity, options.filter);

    // const qb = this.connection.createQueryBuilder<T>(entity, entity.name.toLowerCase());
    // FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
    //   relations: extendedOptions.relations,
    //   take,
    //   skip,
    //   where: extendedOptions.where || {},
    // } as FindManyOptions<T>);
    // tslint:disable-next-line:no-non-null-assertion
    // FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

    // filter.forEach(({clause, parameters}) => {
    //   qb.andWhere(clause, parameters);
    // });

    // if (extendedOptions.channelId) {
    //   const channelFilter = parseChannelParam(this.connection, entity, extendedOptions.channelId);
    //   if (channelFilter) {
    //     qb.andWhere(channelFilter.clause, channelFilter.parameters);
    //   }
    // }

    // return qb.orderBy(sort);
    // return qb
  }
}
