import {InitialisedList} from "./prisma/prisma-schema";
import { getGraphQLSchema } from "./graphql/graphql-schema";
import {SchemaConfig} from "./types/config";

export function createGraphQLSchema(
  config: SchemaConfig,
  lists: Record<string, InitialisedList>,
  // adminMeta: AdminMetaRootVal
) {
  // Start with the core picker-cc graphQL schema
  let graphQLSchema = getGraphQLSchema(lists, {
    mutation: config.session
      ? {
        // endSession: graphql.field({
        //   type: graphql.nonNull(graphql.Boolean),
        //   async resolve(rootVal, args, context) {
        //     if (context.endSession) {
        //       await context.endSession();
        //     }
        //     return true;
        //   },
        // }),
      }
      : {},
    query: {
      // picker-cc: graphql.field({
      //   type: graphql.nonNull(KeystoneMeta),
      //   resolve: () => ({ adminMeta }),
      // }),
    },
  });

  // Merge in the user defined graphQL API
  if (config.extendGraphqlSchema) {
    graphQLSchema = config.extendGraphqlSchema(graphQLSchema);
  }

  return graphQLSchema;
}
