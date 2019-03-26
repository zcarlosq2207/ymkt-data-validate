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
const aws_sdk_1 = require("aws-sdk");
const mssql_1 = require("mssql");
const cfg = require("config");
const dbConnectionConfig = cfg.get('ConnectionsStrings');
function getS3Object(fileName) {
    console.log('Downloading consultants file...');
    const region = process.env.INPUT_BUCKET_REGION;
    const accessKeyId = process.env.INPUT_BUCKET_ACCESS_KEY_ID;
    const secretAccessKey = process.env.INPUT_BUCKET_SECRET_ACCESS_KEY;
    const bucket = process.env.INPUT_BUCKET_NAME;
    const key = fileName;
    const config = new aws_sdk_1.Config({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    });
    let s3 = new aws_sdk_1.S3(config);
    let params = {
        Bucket: bucket,
        Key: key,
    };
    console.log(`Getting Object ${key} from S3`);
    const rs = s3.getObject(params).createReadStream();
    const { chain } = require('stream-chain');
    const { parser } = require('stream-json');
    const { streamValues } = require('stream-json/streamers/StreamValues');
    const s3Pipeline = chain([
        rs,
        parser(),
        streamValues(),
        data => {
            return data.value;
        }
    ]);
    return s3Pipeline;
}
exports.getS3Object = getS3Object;
function getPool(country) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Connecting to SQL Server...');
        const config = dbConnectionConfig.get(country);
        return yield new mssql_1.ConnectionPool(config).connect();
    });
}
exports.getPool = getPool;
function getTableCampaings() {
    const tableName = 'CoachVirtual.TempCampaings';
    let table = new mssql_1.Table(tableName);
    table.create = false;
    table.columns.add('CodPais', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('CodConsultora', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('AnioCampanaProceso', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('AnioCampanaExposicion', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('CodComportamiento', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('DesComportamiento', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('CodSegmentoDigital', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('DesSegmentoDigital', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('DesConstanciaNuevas', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('ScoreMarca', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('ScoreCategoria', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('ScoreTop', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('ScoreLanzamientos', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('ProbabilidadFuga', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('ProbabilidadNuevaExitosa', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('ProbabilidadCaidaPromedio', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('DecilFuga', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('DecilNuevaExitosa', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('DecilCaidaPromedio', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagOfertaDigitalUc', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('MontoVentaTotalCampana', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagIpUnico', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagIpUnico5c', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('NroOfertaDigitalPu5c', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagTippingPoint4', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagTippingPoint5', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagTippingPoint6', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('MontoTippingPoint', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagConstanciaActuales', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagPasoPedido', mssql_1.VarChar(500), { nullable: true, primary: false });
    table.columns.add('Token', mssql_1.VarChar(500), { nullable: true, primary: false });
    return table;
}
exports.getTableCampaings = getTableCampaings;
function getTableConsultans() {
    const tableName = 'CoachVirtual.TempConsultans';
    let table = new mssql_1.Table(tableName);
    table.create = false;
    table.columns.add('CodPais', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('Codigo', mssql_1.VarChar(15), { nullable: false, primary: false });
    table.columns.add('DesNombre', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('DesApePaterno', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('DesApeMaterno', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('DocIdentidad', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('DesEstadoCivil', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('FlagCorreoValidado', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('CorreoElectronico', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('FlagCelular', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('TelefonoMovil', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('AnioCampanaIngreso', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('FechaNacimiento', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('AnioCampana', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('CodRegion', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('CodZona', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('DesGerenteZona', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('CodSeccion', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('EdadBelcorp', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('Edad', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('DesDireccion', mssql_1.VarChar(100), { nullable: true, primary: false });
    table.columns.add('FlagDigital', mssql_1.VarChar(50), { nullable: true, primary: false });
    table.columns.add('Token', mssql_1.VarChar(500), { nullable: true, primary: false });
    return table;
}
exports.getTableConsultans = getTableConsultans;
//# sourceMappingURL=index.js.map