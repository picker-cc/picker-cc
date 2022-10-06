"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const wepay_service_1 = require("./wepay.service");
jest.setTimeout(20000);
describe('WePayService Test(Unit)', () => {
    const appId = 'your mini program app id';
    const mchId = 'your wechat mch id';
    const openId = 'your open id in app id above';
    let serial;
    const apiKey = 'your wechat pay api key v3';
    const notifyUrl = 'https://your/path/to/callback';
    let service;
    let prepayId;
    let privateKey;
    let publicKey;
    let outTradeNo = '';
    beforeAll(() => {
        outTradeNo = mchId + Math.random().toString().slice(3);
        service = new wepay_service_1.WePayService();
        privateKey = fs.readFileSync(path.join(__dirname, '..', 'apiclient_key.pem'));
        publicKey = fs.readFileSync(path.join(__dirname, '..', 'apiclient_cert.pem'));
    });
    it('Should get the certificate serial number', () => {
        serial = service.getCertificateSn(publicKey);
        expect(serial).toBeDefined();
    });
    it('Should return prepay_id', async () => {
        const order = {
            appid: appId,
            mchid: mchId,
            description: '测试商品',
            out_trade_no: outTradeNo,
            notify_url: notifyUrl,
            amount: {
                total: 1,
                currency: 'CNY',
            },
            payer: {
                openid: openId,
            },
        };
        try {
            const ret = await service.jsapi(order, serial, privateKey);
            expect(ret.data).toBeDefined();
            expect(ret.data.prepay_id).toBeDefined();
            prepayId = ret.data.prepay_id;
        }
        catch (error) {
        }
    });
    it('Should build the wechat pay parameters', () => {
        const params = service.buildMiniProgramPayment(appId, prepayId, privateKey);
        expect(params).toBeDefined();
        expect(params.paySign).toBeDefined();
    });
    it('Should get platform certificates', async () => {
        const certs = await service.getPlatformCertificates(mchId, serial, privateKey, apiKey);
        expect(certs).toBeDefined();
        expect(Array.isArray(certs)).toStrictEqual(true);
        expect(certs[0].sn).toBeDefined();
    });
    it('Should get one trade by out trade no', async () => {
        const ret = await service.getTransactionByOutTradeNo(outTradeNo, mchId, serial, privateKey);
        expect(ret.data).toBeDefined();
        expect(ret.data.out_trade_no).toStrictEqual(outTradeNo);
    });
    it('Should refund fail', async () => {
        const refundParameters = {
            out_trade_no: outTradeNo,
            out_refund_no: outTradeNo,
            amount: {
                refund: 1,
                total: 1,
                currency: 'CNY',
            },
        };
        try {
            const ret = await service.refund(refundParameters, mchId, serial, privateKey);
            expect(ret).toBeUndefined();
        }
        catch (error) {
            const response = error.response;
            expect(response).toBeDefined();
            expect(response.data).toBeDefined();
            expect(response.data.code).toStrictEqual('RESOURCE_NOT_EXISTS');
        }
    });
    it('Should close one trade', async () => {
        const ret = await service.close(outTradeNo, mchId, serial, privateKey);
        expect(ret.status).toStrictEqual(204);
    });
    it('Should get one refund by refund no', async () => {
        const no = '2022062819392033311872879963';
        const ret = await service.getRefund(no, mchId, serial, privateKey);
        expect(ret.data).toBeDefined();
        expect(ret.data.out_refund_no).toStrictEqual(no);
    });
});
//# sourceMappingURL=wepay.service.spec.js.map