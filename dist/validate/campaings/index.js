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
function exportCampaings(urlFile, typeImport, country) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = Date.now().toString();
        let promises = [];
        let counter = 0;
        let iteration = 0;
        const batchSize = 5000;
        const s3Pipeline = util_1.getS3Object(urlFile);
        const pool = yield util_1.getPool(country);
        let table = util_1.getTableCampaings();
        s3Pipeline.on('data', (value) => __awaiter(this, void 0, void 0, function* () {
            counter++;
            table.rows.add(value.CodPais, value.CodConsultora, value.AnioCampanaProceso, value.AnioCampanaExposicion, value.CodComportamiento, value.DesComportamiento, value.CodSegmentoDigital, value.DesSegmentoDigital, value.DesConstanciaNuevas, value.ScoreMarca, value.ScoreCategoria, value.ScoreTop, value.ScoreLanzamientos, value.ProbabilidadFuga, value.ProbabilidadNuevaExitosa, value.ProbabilidadCaidaPromedio, value.DecilFuga, value.DecilNuevaExitosa, value.DecilCaidaPromedio, value.FlagOfertaDigitalUc, value.MontoVentaTotalCampana, value.FlagIpUnico, value.FlagIpUnico5c, value.NroOfertaDigitalPu5c, value.FlagTippingPoint4, value.FlagTippingPoint5, value.FlagTippingPoint6, value.MontoTippingPoint, value.FlagConstanciaActuales, value.FlagPasoPedido);
            if (counter % batchSize == 0) {
                iteration++;
                console.log(`${iteration}: ${counter} records loaded as bulk data...`);
                const insertRequest = pool.request(); // mssql
                let psql = insertRequest.bulk(table); // mssql
                psql.then(result => { console.log(`SQL bulk insert completed.`); }).catch(err => { console.error(err); }); // mssql
                promises.push(psql); // mssql
                table = util_1.getTableCampaings();
            }
        }));
        s3Pipeline.on('error', err => {
            console.error(err);
        });
        yield eventToPromise(s3Pipeline, 'end');
        const insertRequest = pool.request(); // mssql
        let psql = insertRequest.bulk(table); // mssql
        psql.then(result => { console.log(`SQL bulk insert completed.`); }).catch(err => { console.error(err); }); // mssql
        promises.push(psql); // mssql
        yield Promise.all(promises); // wait for all the promises
        yield pool.close();
        return 0;
    });
}
exports.exportCampaings = exportCampaings;
//# sourceMappingURL=index.js.map