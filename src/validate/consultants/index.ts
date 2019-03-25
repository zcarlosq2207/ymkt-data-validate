import { getS3Object } from '../util';
import * as eventToPromise from 'event-to-promise';

export async function exportConsultants(urlFile: string, typeImport: string, country: string): Promise<number>
{
    let counter = 0;
    const s3Pipeline = getS3Object(urlFile)

    s3Pipeline.on('data', async (value: any) => {
        counter++;
        console.log(JSON.stringify(value));
    });

    s3Pipeline.on('error', err => {
        console.error(err);
    });

    await eventToPromise(s3Pipeline, 'end');


    return 0;
}