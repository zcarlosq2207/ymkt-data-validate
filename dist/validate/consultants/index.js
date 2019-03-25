"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const eventToPromise = require("event-to-promise");
function exportConsultants(urlFile, typeImport, country) {
    return __awaiter(this, void 0, void 0, function* () {
        let counter = 0;
        const s3Pipeline = util_1.getS3Object(urlFile);
        s3Pipeline.on('data', (value) => __awaiter(this, void 0, void 0, function* () {
            counter++;
            console.log(JSON.stringify(value));
        }));
        s3Pipeline.on('error', err => {
            console.error(err);
        });
        yield eventToPromise(s3Pipeline, 'end');
        return 0;
    });
}
exports.exportConsultants = exportConsultants;
//# sourceMappingURL=index.js.map