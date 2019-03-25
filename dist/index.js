#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const campaings_1 = require("./validate/campaings");
const consultants_1 = require("./validate/consultants");
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("Export Campaings/Consultants information into/from Hybris MKT");
program
    .command("campaings")
    .option("-f, --urlFile [urlFile]", "the date used to export the information, if the value is not supplied the URL_FILE env variable is used")
    .option("-t, --typeImport [typeImport]", "the number of records to export per chunk, if the value is not supplied the TYPE_IMPORT env variable is used")
    .option("-c, --country [country]", "the number of records to export per chunk, if the value is not supplied the COUNTRY env variable is used")
    .action(function (options) {
    campaings_1.exportCampaings(options.urlFile, options.typeImport, options.country)
        .then(status => {
        console.log(`Execution status = ${status}`);
        process.exit(status);
    });
});
program
    .command("consultants")
    .option("-f, --urlFile [urlFile]", "the date used to export the information, if the value is not supplied the URL_FILE env variable is used")
    .option("-t, --typeImport [typeImport]", "the number of records to export per chunk, if the value is not supplied the TYPE_IMPORT env variable is used")
    .option("-c, --country [country]", "the number of records to export per chunk, if the value is not supplied the COUNTRY env variable is used")
    .action(function (options) {
    consultants_1.exportConsultants(options.urlFile, options.typeImport, options.country)
        .then(status => {
        console.log(`Execution status = ${status}`);
        process.exit(status);
    });
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map