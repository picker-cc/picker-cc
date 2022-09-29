export type SMSOptions = {
    accessKeyId: string;
    accessKeySecret: string;
    // endpoint: 'https://dysmsapi.aliyuncs.com',
    endpoint?: string;
    // apiVersion: '2017-05-25',
    apiVersion?: string;

    // SignName: "SignName",
    SignName: string;
    // 发送验证码模板
    // TemplateCode_Code: "TemplateCode_Code"
    TemplateCode_Code: string;
}
