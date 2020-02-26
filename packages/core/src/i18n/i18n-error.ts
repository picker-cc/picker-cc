import { ApolloError } from 'apollo-server-core';

import {LogLevel} from '../config/logger/picker-logger';

export abstract class I18nError extends ApolloError {
  protected constructor(
    public message: string,
    public variables: { [key: string]: string | number } = {},
    public code?: string,
    public logLevel: LogLevel = LogLevel.Warn,
  ) {
    super(message, code);
  }
}
