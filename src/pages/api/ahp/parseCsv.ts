import { NextApiRequest, NextApiResponse } from 'next';

export default async function parseCsv(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, body } = request;

  if (method === 'POST') {
    const rows = body.data.split('\n');

    const parsedCSV = rows.map((row: string) => row.split(','));

    return response.status(200).json(parsedCSV);
  }

  return response.status(400);
}
