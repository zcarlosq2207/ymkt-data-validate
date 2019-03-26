import { getS3Object, getPool, getTableCampaings } from '../util';
import * as eventToPromise from 'event-to-promise';
import { config, ConnectionPool, Table, VarChar } from 'mssql';

export async function exportCampaings(urlFile: string, typeImport: string, country: string): Promise<number> {
    const token = Date.now().toString();
    
    let promises = [];
    let counter = 0;
    let iteration = 0;
    const batchSize = 5000;

    const s3Pipeline = getS3Object(urlFile);
    const pool = await getPool(country)
    let table = getTableCampaings();

    s3Pipeline.on('data', async (value: any) => {
        counter++;
        table.rows.add(value.CodPais,value.CodConsultora,value.AnioCampanaProceso,
            value.AnioCampanaExposicion,value.CodComportamiento,value.DesComportamiento,
            value.CodSegmentoDigital,value.DesSegmentoDigital,value.DesConstanciaNuevas,
            value.ScoreMarca,value.ScoreCategoria,value.ScoreTop,value.ScoreLanzamientos,
            value.ProbabilidadFuga,value.ProbabilidadNuevaExitosa,value.ProbabilidadCaidaPromedio,
            value.DecilFuga,value.DecilNuevaExitosa,value.DecilCaidaPromedio,
            value.FlagOfertaDigitalUc,value.MontoVentaTotalCampana,value.FlagIpUnico,
            value.FlagIpUnico5c,value.NroOfertaDigitalPu5c,value.FlagTippingPoint4,
            value.FlagTippingPoint5,value.FlagTippingPoint6,value.MontoTippingPoint,
            value.FlagConstanciaActuales,value.FlagPasoPedido);

        if (counter % batchSize == 0) {
            iteration++;
            console.log(`${iteration}: ${counter} records loaded as bulk data...`);
            const insertRequest = pool.request(); // mssql
            let psql = insertRequest.bulk(table); // mssql
            psql.then(result => { console.log(`SQL bulk insert completed.`) }).catch(err => { console.error(err) }); // mssql
            promises.push(psql); // mssql
            table =  getTableCampaings()
        }

    });

    s3Pipeline.on('error', err => {
        console.error(err);
    });

    await eventToPromise(s3Pipeline, 'end');
    const insertRequest = pool.request(); // mssql
    let psql = insertRequest.bulk(table); // mssql
    psql.then(result => { console.log(`SQL bulk insert completed.`) }).catch(err => { console.error(err) }); // mssql
    promises.push(psql); // mssql

    await Promise.all(promises); // wait for all the promises
    await pool.close();
    return 0;
}