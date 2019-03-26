import { Config, S3 } from 'aws-sdk';
import { config, ConnectionPool, Table, VarChar, MAx } from 'mssql';
import * as cfg from 'config';

const dbConnectionConfig: cfg.IConfig = cfg.get('ConnectionsStrings');

export function getS3Object(fileName: string) {
    console.log('Downloading consultants file...');
    const region = process.env.INPUT_BUCKET_REGION;
    const accessKeyId = process.env.INPUT_BUCKET_ACCESS_KEY_ID;
    const secretAccessKey = process.env.INPUT_BUCKET_SECRET_ACCESS_KEY;
    const bucket = process.env.INPUT_BUCKET_NAME;
    const key = fileName;

    const config = new Config({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
    });

    let s3 = new S3(config);

    let params: S3.GetObjectRequest = {
        Bucket: bucket,
        Key: key,
    }

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

export async function getPool(country: string) {
    console.log('Connecting to SQL Server...');
    const config: config = dbConnectionConfig.get(country);
    return await new ConnectionPool(config).connect();
}


export function getTableCampaings() : Table
{
    const tableName = 'CoachVirtual.TempCampaings';
    let table = new Table(tableName);
    table.create = false;
    table.columns.add('CodPais', VarChar(500), { nullable: true, primary: false });
    table.columns.add('CodConsultora', VarChar(500), { nullable: true, primary: false });
    table.columns.add('AnioCampanaProceso', VarChar(500), { nullable: true, primary: false });
    table.columns.add('AnioCampanaExposicion', VarChar(500), { nullable: true, primary: false });
    table.columns.add('CodComportamiento', VarChar(500), { nullable: true, primary: false });
    table.columns.add('DesComportamiento', VarChar(500), { nullable: true, primary: false });
    table.columns.add('CodSegmentoDigital', VarChar(500), { nullable: true, primary: false });
    table.columns.add('DesSegmentoDigital', VarChar(500), { nullable: true, primary: false });
    table.columns.add('DesConstanciaNuevas', VarChar(500), { nullable: true, primary: false });
    table.columns.add('ScoreMarca', VarChar(500), { nullable: true, primary: false });
    table.columns.add('ScoreCategoria', VarChar(500), { nullable: true, primary: false });
    table.columns.add('ScoreTop', VarChar(500), { nullable: true, primary: false });
    table.columns.add('ScoreLanzamientos', VarChar(500), { nullable: true, primary: false });
    table.columns.add('ProbabilidadFuga', VarChar(500), { nullable: true, primary: false });
    table.columns.add('ProbabilidadNuevaExitosa', VarChar(500), { nullable: true, primary: false });
    table.columns.add('ProbabilidadCaidaPromedio', VarChar(500), { nullable: true, primary: false });
    table.columns.add('DecilFuga', VarChar(500), { nullable: true, primary: false });
    table.columns.add('DecilNuevaExitosa', VarChar(500), { nullable: true, primary: false });
    table.columns.add('DecilCaidaPromedio', VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagOfertaDigitalUc', VarChar(500), { nullable: true, primary: false });
    table.columns.add('MontoVentaTotalCampana', VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagIpUnico', VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagIpUnico5c', VarChar(500), { nullable: true, primary: false });
    table.columns.add('NroOfertaDigitalPu5c', VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagTippingPoint4', VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagTippingPoint5', VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagTippingPoint6', VarChar(500), { nullable: true, primary: false });
    table.columns.add('MontoTippingPoint', VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagConstanciaActuales', VarChar(500), { nullable: true, primary: false });
    table.columns.add('FlagPasoPedido', VarChar(500), { nullable: true, primary: false });
    table.columns.add('Token', VarChar(500), { nullable: true, primary: false });
    return table;
}