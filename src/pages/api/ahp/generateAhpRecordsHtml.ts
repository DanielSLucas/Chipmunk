import { NextApiRequest, NextApiResponse } from 'next';
import { Record } from 'chipmunk-statistics-lib/lib/ahp/functions/types';

const htmlHead =
  "<!DOCTYPE html><html lang='pt-br'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><script>MathJax = {loader: { load: ['input/asciimath', 'output/chtml', 'ui/menu'] }, asciimath: {delimiters: [['$', '$']]}};</script><script type='text/javascript' id='MathJax-script' async src='https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.js'></script><title>Cáculos AHP</title><style>table {border-collapse: collapse;table-layout: fixed;margin: 1rem 0;}table td {border: 1px solid black;padding: 0.5rem;}table th {border: 1px solid black;padding: 0.5rem;}main {overflow-x: scroll;}.dados {padding: 0 15%;display: flex;flex-direction: column;align-items: center;}.table-calcs {padding: 0 15%;display: flex;flex-direction: column;align-items: center;}.calcs {display: flex;flex-direction: column;align-items: center;justify-content: space-around;}.calcs .calc {display: none;margin: 1rem 0;}.calcs .sums,.calcs .priorities {display: initial;}.calcs .sums {margin-right: 2rem;}.ponderation .calcs .sums {margin-right: 0;}.ponderation .calcs .calc {display: initial;}tr.bestDecision {background-color: rgb(178, 230, 178);color: green;font-weight: bold;}</style></head><body>";
const htmlFooter = '</body></html>';

export default async function generateAhpRecordsHtml(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, body } = request;

  if (method === 'POST') {
    const records: Record[] = body.data;

    const htmlBody = records
      .map(record => {
        const table = record.table
          .map(row => {
            const rowItens = row
              .map(item => {
                if (typeof item === 'number')
                  return `<td>${item.toFixed(2)}</td>`;
                return `<th>${item}</th>`;
              })
              .join('\n');

            return `<tr>${rowItens}</tr>`;
          })
          .join('\n');

        const calcs = record.calcs
          .map((calc, i) => {
            let calcClass = '';

            if (i === 0) calcClass = 'sums';
            if (i === 1) calcClass = 'priorities';

            const calcWithBr = calc.replaceAll('\n', '<br>');

            return `<div class="calc ${calcClass}">${calcWithBr}</div>`;
          })
          .join('\n');

        return `<section class="table-calcs ${
          record.title === 'ponderacao' ? 'ponderation' : ''
        }">
        <h2>${record.title}</h2>
        <table>
          ${table}
        </table>

        <div class="calcs">
          ${calcs}
        </div>
      </section>`;
      })
      .join('\n');

    const recordsAsHtml = `
      ${htmlHead}
      ${htmlBody}
      ${htmlFooter}
    `;

    return response.status(200).json({ recordsAsHtml });
  }

  return response.status(400);
}
