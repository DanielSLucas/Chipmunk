import { NextApiRequest, NextApiResponse } from 'next';
import { ahp } from '../../../public/ahpFunctions.js';

export default async function decide(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, body } = request;

  if (method === 'POST') {
    const { serializedData, humanInput } = body;

    const ahpDecision = ahp(serializedData, humanInput);

    return response.status(200).json(ahpDecision);
  }

  return response.status(400);
}