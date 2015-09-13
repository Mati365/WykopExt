"use strict";

declare let Components;
declare let __SCRIPT_URI_SPEC__;

const { utils: Cu } = Components;
const rootURI = __SCRIPT_URI_SPEC__.replace("bootstrap.js", "");
const COMMONJS_URI = "resource://gre/modules/commonjs";
const { require } = Cu.import(COMMONJS_URI + "/toolkit/require.js", {});
const { Bootstrap } = require(COMMONJS_URI + "/sdk/addon/bootstrap.js");
const { startup, shutdown, install, uninstall } = new Bootstrap(rootURI);
