import {ArgumentsHost, ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {Request, Response} from 'express';
import {GraphQLResolveInfo} from 'graphql';

/**
 * Parses in the Nest ExecutionContext of the incoming request, accounting for both
 * GraphQL & REST requests.
 */
export function parseContext(
  context: ExecutionContext | ArgumentsHost,
): { req: Request; res: Response; isGraphQL: boolean; info?: GraphQLResolveInfo } {
  console.log('开始格式化上下文')
  const graphQlContext = GqlExecutionContext.create(context as ExecutionContext);
  const restContext = GqlExecutionContext.create(context as ExecutionContext);
  const info = graphQlContext.getInfo();
  let req: Request;
  let res: Response;
  if (info) {
    const ctx = graphQlContext.getContext();
    req = ctx.req;
    res = ctx.res;
  } else {
    req = context.switchToHttp().getRequest();
    res = context.switchToHttp().getResponse();
  }
  return {
    req,
    res,
    info,
    isGraphQL: !!info,
  };
}
