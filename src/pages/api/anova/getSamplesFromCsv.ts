import { NextApiRequest, NextApiResponse } from 'next';

export default async function getSamplesFromCsv(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, body } = request;

  if (method === 'POST') {
    const rows = body.data.split('\n');

    const titles = rows.shift().split(',');

    const csvAsArray: (string | number)[][] = rows.map((row: string) => {
      return row.split(',').map(item => {
        return item;
      });
    });

    const samples = csvAsArray[0].map((_, i) => {
      return csvAsArray.map((__, j) => {
        return csvAsArray[j][i] !== '' ? Number(csvAsArray[j][i]) : null;
      });
    });

    return response.status(200).json({
      titles,
      samples,
    });
  }

  return response.status(400);
}
