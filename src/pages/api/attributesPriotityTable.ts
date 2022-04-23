import { NextApiRequest, NextApiResponse } from 'next';
import { createAttributesPriotityTable } from 'chipmunk-statistics-lib/lib/ahp/utils';

export default async function attributesPriotityTable(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, body } = request;

  if (method === 'POST') {
    const { attributes, rankedAttributes } = body;

    const newAttributesPriotityTable = createAttributesPriotityTable(
      attributes,
      rankedAttributes,
    );

    return response.status(200).json(newAttributesPriotityTable);
  }

  return response.status(400);
}
