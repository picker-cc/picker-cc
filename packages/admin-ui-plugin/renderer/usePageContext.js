"use strict";
exports.__esModule = true;
exports.setPageContext = exports.usePageContext = void 0;
var vue_1 = require("vue");
var key = Symbol();
function usePageContext() {
    var pageContext = (0, vue_1.inject)(key);
    if (!pageContext)
        throw new Error('setPageContext() not called in parent');
    return pageContext;
}
exports.usePageContext = usePageContext;
function setPageContext(app, pageContext) {
    app.provide(key, pageContext);
}
exports.setPageContext = setPageContext;
