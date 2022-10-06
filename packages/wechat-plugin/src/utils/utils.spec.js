"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
describe('Test utils', () => {
    it('test parse rid', () => {
        const rid = '626d1edb-0ff6bf1f-3bc3f260';
        const errMsg = `invalid credential, access_token is invalid or not latest rid: ${rid}`;
        const result = (0, index_1.parseRid)(errMsg);
        expect(result).toStrictEqual(rid);
        expect((0, index_1.parseRid)({})).toStrictEqual('');
        expect((0, index_1.parseRid)('no rid to parse')).toStrictEqual('');
    });
});
//# sourceMappingURL=utils.spec.js.map