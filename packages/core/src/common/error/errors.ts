/**
 * @description
 * This error should be thrown when some unexpected and exceptional case is encountered.
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
import {I18nError} from '../../i18n/i18n-error';
import {LogLevel} from '../../config/logger/picker-logger';

/**
 * @description
 * 当遇到意外和异常情况时，应抛出此错误。
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class InternalServerError extends I18nError {
  constructor(message: string, variables: { [key: string]: string | number } = {}) {
    super(message, variables, 'INTERNAL_SERVER_ERROR', LogLevel.Error);
  }
}

/**
 * @description
 * 当用户输入不符合预期时，应抛出此错误。
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class UserInputError extends I18nError {
  constructor(message: string, variables: { [key: string]: string | number } = {}) {
    super(message, variables, 'USER_INPUT_ERROR', LogLevel.Warn);
  }
}

/**
 * @description
 * 当尝试不允许的非法操作时，应抛出此错误。
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class IllegalOperationError extends I18nError {
  constructor(message: string, variables: { [key: string]: string | number } = {}) {
    super(message, variables, 'ILLEGAL_OPERATION', LogLevel.Warn);
  }
}

/**
 * @description
 * 当用户的身份验证凭据不匹配时，应抛出此错误。
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class UnauthorizedError extends I18nError {
  constructor() {
    super('error.unauthorized', {}, 'UNAUTHORIZED', LogLevel.Info);
  }
}

/**
 * @description
 * 当用户试图访问外部资源没有权限时, 应抛出此错误。
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class ForbiddenError extends I18nError {
  constructor() {
    super('error.forbidden', {}, 'FORBIDDEN', LogLevel.Warn);
  }
}

/**
 * @description
 * *当验证令牌(用于验证客户的电子邮件时)抛出此错误，无效或不匹配任何预期的令牌。
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class VerificationTokenError extends I18nError {
  constructor() {
    super('error.verification-token-not-recognized', {}, 'BAD_VERIFICATION_TOKEN', LogLevel.Warn);
  }
}

/**
 * @description
 * 验证 Token 过期时错误
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class VerificationTokenExpiredError extends I18nError {
  constructor() {
    super('error.verification-token-has-expired', {}, 'EXPIRED_VERIFICATION_TOKEN', LogLevel.Warn);
  }
}

/**
 * @description
 * 当试图重置客户密码时发生错误时，应抛出此错误。
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class PasswordResetTokenError extends I18nError {
  constructor() {
    super('error.password-reset-token-not-recognized', {}, 'BAD_PASSWORD_RESET_TOKEN', LogLevel.Warn);
  }
}


/**
 * @description
 * 用户未确认验证信息
 *
 * @docsCategory errors
 * @docsPage Error Types
 */
export class NotVerifiedError extends I18nError {
  constructor() {
    super('error.email-address-not-verified', {}, 'NOT_VERIFIED', LogLevel.Warn);
  }
}
