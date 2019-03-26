import { getS3Object, getPool, getTableCampaings, getTableConsultans } from '../util';
import * as eventToPromise from 'event-to-promise';
import { config, ConnectionPool, Table, VarChar } from 'mssql';


export async function exportConsultants(urlFile: string, typeImport: string, country: string): Promise<number>
{
    const token = Date.now().toString();
    
    let promises = [];
    let counter = 0;
    let iteration = 0;
    const batchSize = 5000;

    const s3Pipeline = getS3Object(urlFile);
    const pool = await getPool(country)
    let table = getTableConsultans();

    s3Pipeline.on('data', async (value: any) => {
        counter++;
        table.rows.add(value.CodPais,value.CodEbelista,value.DesNombre,
            value.DesApePaterno,value.DesApeMaterno,
            value.DocIdentidad,value.DesEstadoCivil,value.FlagCorreoValidado,
            value.CorreoElectronico,value.FlagCelular,value.TelefonoMovil,value.AnioCampanaIngreso,
            value.FechaNacimiento,value.AnioCampana,
            value.CodRegion,value.CodZona,
            value.DesGerenteZona,value.CodSeccion,
            value.EdadBelcorp,value.Edad,value.DesDireccion,
            value.FlagDigital);

        if (counter % batchSize == 0) {
            iteration++;
            console.log(`${iteration}: ${counter} records loaded as bulk data...`);
            const insertRequest = pool.request(); // mssql
            let psql = insertRequest.bulk(table); // mssql
            psql.then(result => { console.log(`SQL bulk insert completed.`) }).catch(err => { console.error(err) }); // mssql
            promises.push(psql); // mssql
            table =  getTableConsultans()
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