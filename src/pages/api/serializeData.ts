import { NextApiRequest, NextApiResponse } from 'next';
import {
  parseCSV,
  serializeData as serializeDataF,
} from '../../../public/ahpFunctions.js';

export default async function serializeData(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, body } = request;

  if (method === 'POST') {
    const parsedCSV = parseCSV(body.data);

    const serializedData = serializeDataF(parsedCSV);

    return response.status(200).json(serializedData);
  }

  return response.status(400);
}
