#!/usr/bin/env node

import { Command } from 'commander';
import { exportCampaings } from './validate/campaings';
import { exportConsultants } from './validate/consultants'

const program = new Command();

program
    .version("1.0.0")
    .description("Export Campaings/Consultants information into/from Hybris MKT");


program
    .command("campaings")
    .option("-f, --urlFile [urlFile]", "the date used to export the information, if the value is not supplied the URL_FILE env variable is used")
    .option("-t, --typeImport [typeImport]", "the number of records to export per chunk, if the value is not supplied the TYPE_IMPORT env variable is used")
    .option("-c, --country [country]", "the number of records to export per chunk, if the value is not supplied the COUNTRY env variable is used")
    .action(function (options) {
        exportCampaings(options.urlFile, options.typeImport, options.country)
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
        exportConsultants(options.urlFile, options.typeImport, options.country)
            .then(status => {
                console.log(`Execution status = ${status}`);
                process.exit(status);
            });
    });

program.parse(process.argv);
