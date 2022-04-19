import { NextApiRequest, NextApiResponse } from 'next';
import { parseCSV } from '../../../public/ahpFunctions.js';

export default async function parseCsv(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, body } = request;

  if (method === 'POST') {
    const parsedCSV = parseCSV(body.data);

    return response.status(200).json(parsedCSV);
  }

  return response.status(400);
}
