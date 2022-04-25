import { anova } from 'chipmunk-statistics-lib';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function getSamplesFromCsv(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, body } = request;

  if (method === 'POST') {
    const { samples, alpha } = body;

    const result = anova(samples, alpha);

    return response.status(200).json(result);
  }

  return response.status(400);
}
