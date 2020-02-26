import {generate} from '@graphql-codegen/cli';
import fs from 'fs';
import {buildClientSchema, graphqlSync, introspectionQuery} from 'graphql';
// import { mergeSchemas } from 'graphql-tools';
import path from 'path';

import {ADMIN_API_PATH, API_PORT, SNS_API_PATH} from '../../packages/common/src/shared-constants';

import { downloadIntrospectionSchema } from './download-introspection-schema';

// const ADMIN_SCHEMA_OUTPUT_FILE = path.join(__dirname, '../../schema-admin.json');
const SNS_SCHEMA_OUTPUT_FILE = path.join(__dirname, '../../schema-sns.json');

// tslint:disable:no-console

Promise.all([
  // downloadIntrospectionSchema(ADMIN_API_PATH, ADMIN_SCHEMA_OUTPUT_FILE),
  downloadIntrospectionSchema(SNS_API_PATH, SNS_SCHEMA_OUTPUT_FILE),
])
  .then(([adminSchemaSuccess, shopSchemaSuccess]) => {
    if (!adminSchemaSuccess || !shopSchemaSuccess) {
      console.log('Attempting to generate types from existing schema json files...');
    }

    // const adminSchemaJson = JSON.parse(fs.readFileSync(ADMIN_SCHEMA_OUTPUT_FILE, 'utf-8'));
    const snsSchemaJson = JSON.parse(fs.readFileSync(SNS_SCHEMA_OUTPUT_FILE, 'utf-8'));
    // const adminSchema = buildClientSchema(adminSchemaJson.data);
    const shopSchema = buildClientSchema(snsSchemaJson.data);

    const config = {
      namingConvention: {
        enumValues: 'keep',
      },
      strict: true,
    };
    const commonPlugins = [
      { add: '// tslint:disable' },
      'typescript',
    ];
    const clientPlugins = [
      ...commonPlugins,
      'typescript-operations',
      'typescript-compatibility',
    ];

    return generate({
      overwrite: true,
      generates: {
        // [path.join(__dirname, '../../packages/common/src/generated-types.ts')]: {
          // schema: [ADMIN_SCHEMA_OUTPUT_FILE],
          // plugins: commonPlugins,
          // config,
        // },
        [path.join(__dirname, '../../packages/common/src/generated-sns-types.ts')]: {
          schema: [SNS_SCHEMA_OUTPUT_FILE],
          plugins: commonPlugins,
          config,
        },
      },
    });
  })
  .then(
    result => {
      process.exit(0);
    },
    err => {
      console.error(err);
      process.exit(1);
    },
  );
