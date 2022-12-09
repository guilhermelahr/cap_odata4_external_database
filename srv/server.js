//Server is required to expose odata V2
//Check https://www.npmjs.com/package/@sap/cds-odata-v2-adapter-proxy
//npm install @sap/cds-odata-v2-adapter-proxy -s

const cds = require("@sap/cds");
const cov2ap = require("@sap/cds-odata-v2-adapter-proxy");
cds.on("bootstrap", (app) => app.use(cov2ap()));
module.exports = cds.server;