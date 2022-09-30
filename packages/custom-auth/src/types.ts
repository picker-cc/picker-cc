import {BaseListTypeInfo, PickerContext} from "@picker-cc/core";

export type AuthGqlNames = {
    CreateInitialInput: string;
    createInitialItem: string;
    authenticateItemWithPassword: string;
    ItemAuthenticationWithPasswordResult: string;
    ItemAuthenticationWithPasswordSuccess: string;
    ItemAuthenticationWithPasswordFailure: string;
    sendItemPasswordResetLink: string;
    SendItemPasswordResetLinkResult: string;
    validateItemPasswordResetToken: string;
    ValidateItemPasswordResetTokenResult: string;
    redeemItemPasswordResetToken: string;
    RedeemItemPasswordResetTokenResult: string;
    sendItemMagicAuthLink: string;
    SendItemMagicAuthLinkResult: string;
    redeemItemMagicAuthToken: string;
    RedeemItemMagicAuthTokenResult: string;
    RedeemItemMagicAuthTokenSuccess: string;
    RedeemItemMagicAuthTokenFailure: string;
};

export type SendTokenFn = (args: {
    itemId: string | number | bigint;
    identity: string;
    token: string;
    context: PickerContext;
}) => Promise<void> | void;

export type AuthTokenTypeConfig = {
    /** Called when a user should be sent the magic signin token they requested */
    sendToken: SendTokenFn;
    /** How long do tokens stay valid for from time of issue, in minutes **/
    tokensValidForMins?: number;
};

export type AuthConfig<ListTypeInfo extends BaseListTypeInfo> = {
    /** 用于对用户身份验证的列表的键 */
    listKey: ListTypeInfo['key'];
    /** 存储身份的唯一标识字段，必需是文本字段 */
    identityField: ListTypeInfo['fields'];
    /** 存储验证信息的字段，一般为*/
    /** must be password-ish 必需是密码形式的 */
    secretField: ListTypeInfo['fields'];
    /**初始的 user/db 种子功能 */
    initFirstItem?: InitFirstItemConfig<ListTypeInfo>;
    /** 密码重置链接功能 */
    passwordResetLink?: AuthTokenTypeConfig;
    /** "Magic link" 功能，比如点链接登录/重置密码 */
    magicAuthLink?: AuthTokenTypeConfig;
    /** 填充 session Data*/
    sessionData?: string;
};

export type InitFirstItemConfig<ListTypeInfo extends BaseListTypeInfo> = {
    /** Array of fields to collect, e.g ['name', 'email', 'password'] */
    /** 要收集的字段数组，例如：['name', 'email', 'password']*/
    fields: readonly ListTypeInfo['fields'][];
    /** Extra input to add for the create mutation */
    /** 为 create mutation 添加额外的输入数据 */
    itemData?: Partial<ListTypeInfo['inputs']['create']>;
};

export type AuthTokenRedemptionErrorCode = 'FAILURE' | 'TOKEN_EXPIRED' | 'TOKEN_REDEEMED';

export type SecretFieldImpl = {
    generateHash: (secret: string) => Promise<string>;
    compare: (secret: string, hash: string) => Promise<string>;
};
