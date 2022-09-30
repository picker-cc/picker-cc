"use strict";
exports.__esModule = true;
exports.createApp = void 0;
var vue_1 = require("vue");
var PageShell_vue_1 = require("./PageShell.vue");
var usePageContext_1 = require("./usePageContext");
function createApp(pageContext) {
    var Page = pageContext.Page, pageProps = pageContext.pageProps;
    var PageWithLayout = (0, vue_1.defineComponent)({
        render: function () {
            return (0, vue_1.h)(PageShell_vue_1["default"], {}, {
                "default": function () {
                    return (0, vue_1.h)(Page, pageProps || {});
                }
            });
        }
    });
    var app = (0, vue_1.createSSRApp)(PageWithLayout);
    // Make `pageContext` available from any Vue component
    (0, usePageContext_1.setPageContext)(app, pageContext);
    return app;
}
exports.createApp = createApp;
