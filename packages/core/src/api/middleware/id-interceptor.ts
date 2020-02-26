import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {VariableValues} from 'apollo-server-core';
import {GraphQLSchema} from 'graphql';
import {Observable} from 'rxjs';

import {GraphqlValueTransformer} from '../common/graphql-value-transformer';
import {parseContext} from '../common/parse-context';

@Injectable()
export class IdInterceptor implements NestInterceptor {
  private graphQlValueTransformers = new WeakMap<GraphQLSchema, GraphqlValueTransformer>();

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    console.log('我是拦截器')
    const {isGraphQL, req} = parseContext(context);
    if (isGraphQL) {
      const args = GqlExecutionContext.create(context).getArgs();
      const info = GqlExecutionContext.create(context).getInfo();
      const transformer = this.getTransformerForSchema(info.schema);
      // this.decodeIdArguments(transformer, info.operation, args);
    }
    return next.handle();
  }

  private getTransformerForSchema(schema: GraphQLSchema): GraphqlValueTransformer {
    const existing = this.graphQlValueTransformers.get(schema);
    if (existing) {
      return existing;
    }
    const transformer = new GraphqlValueTransformer(schema);
    this.graphQlValueTransformers.set(schema, transformer);
    return transformer;
  }

}
