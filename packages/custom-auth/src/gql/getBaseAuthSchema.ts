
import { AuthGqlNames, SecretFieldImpl } from '../types';

import { validateSecret } from '../lib/validateSecret';
import {graphql, BaseItem, PickerContext} from "@picker-cc/core";

export function getBaseAuthSchema<I extends string, S extends string>({
  listKey,
  identityField,
  secretField,
  gqlNames,
  secretFieldImpl,
  base,
}: {
  listKey: string;
  identityField: I;
  secretField: S;
  gqlNames: AuthGqlNames;
  secretFieldImpl: SecretFieldImpl;
  base: graphql.BaseSchemaMeta;
}): any {
  const ItemAuthenticationWithPasswordSuccess = graphql.object<{
    sessionToken: string;
    item: BaseItem;
  }>()({
    name: gqlNames.ItemAuthenticationWithVerifyCodeSuccess,
    fields: {
      sessionToken: graphql.field({ type: graphql.nonNull(graphql.String) }),
      item: graphql.field({ type: graphql.nonNull(base.object(listKey)) }),
    },
  });
  const ItemAuthenticationWithPasswordFailure = graphql.object<{ message: string }>()({
    name: gqlNames.ItemAuthenticationWithVerifyCodeFailure,
    fields: {
      message: graphql.field({ type: graphql.nonNull(graphql.String) }),
    },
  });
  const AuthenticationResult = graphql.union({
    name: gqlNames.ItemAuthenticationWithVerifyCodeResult,
    types: [ItemAuthenticationWithPasswordSuccess, ItemAuthenticationWithPasswordFailure],
    resolveType(val) {
      if ('sessionToken' in val) {
        return gqlNames.ItemAuthenticationWithVerifyCodeSuccess;
      }
      return gqlNames.ItemAuthenticationWithVerifyCodeFailure;
    },
  });
  const extension = {
    query: {
      authenticatedItem: graphql.field({
        type: graphql.union({
          name: 'AuthenticatedItem',
          types: [base.object(listKey) as graphql.ObjectType<BaseItem>],
          resolveType: (root, context) => context.session?.listKey,
        }),
        resolve(root, args, { session, db }) {
          if (typeof session?.itemId === 'string' && typeof session.listKey === 'string') {
            return db[session.listKey].findOne({ where: { id: session.itemId } });
          }
          return null;
        },
      }),
    },
    mutation: {
      [gqlNames.authenticateItemWithVerifyCode]: graphql.field({
        type: AuthenticationResult,
        args: {
          [identityField]: graphql.arg({ type: graphql.nonNull(graphql.String) }),
          [secretField]: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(root, { [identityField]: identity, [secretField]: secret }, context) {
          if (!context.startSession) {
            throw new Error('上下文上没有可用的会话实现');
          }

          const dbItemAPI = context.sudo().db[listKey];
          const result = await validateSecret(
            secretFieldImpl,
            identityField,
            identity,
            secretField,
            secret,
            dbItemAPI
          );

          if (!result.success) {
            return { code: 'FAILURE', message: '身份验证失败。' };
          }

          // Update system state
          const sessionToken = await context.startSession({
            listKey,
            itemId: result.item.id.toString(),
          });
          return { sessionToken, item: result.item };
        },
      }),
    },
  };
  return { extension, ItemAuthenticationWithPasswordSuccess };
}
