import { NextApiRequest, NextApiResponse } from 'next';
import { Record } from 'chipmunk-statistics-lib/lib/ahp/functions/types';

const htmlHead = `<!DOCTYPE html> <html lang="pt-br"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <script> MathJax = { loader: { load: ["input/asciimath", "output/chtml", "ui/menu"] }, asciimath: { delimiters: [["$", "$"]] }, }; </script> <script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.js" ></script> <title>Cáculos AHP</title> <style> mjx-container mjx-math { white-space: normal; } table { border-collapse: collapse; table-layout: fixed; margin: 1rem 0; } table td { border: 1px solid rgba(2, 109, 231, 0.932); padding: 0.5rem; } table th { border: 1px solid rgba(0, 140, 255, 0.897); padding: 0.5rem; } main { overflow-x: scroll; } .dados { padding: 0 15%; display: flex; flex-direction: column; align-items: center; } .table-calcs { padding: 0 15%; display: flex; flex-direction: column; align-items: center; } .calcs { display: flex; flex-direction: column; align-items: center; justify-content: space-around; } .calcs .calc { margin: 1rem 0; } .calcs .sums, .calcs .priorities { display: initial; } .calcs .sums { margin-right: 2rem; } .ponderation .calcs .sums { margin-right: 0; } .ponderation .calcs .calc { display: initial; } tr.bestDecision { background-color: rgb(178, 230, 178); color: green; font-weight: bold; } * { font-family: sans-serif; font-weight: normal; font-weight: bold; color: #1337a1; } th { background-color: #d4dbe0ce; } .calc { background-color: #c5ccd121; } td { width: 150px; margin-left: auto; margin-right: auto; font-size: large; text-align-last: center; } body { background: url("${process.env.NEXT_PUBLIC_URL}/acorn.png"); background-size: 50px; background-color: #c5ccd127; } section { max-width: 30%; margin: auto; padding: 10%; background-color: rgba(255, 255, 255, 0.938); } </style> </head> <body>`;
const htmlFooter = '</body></html>';
export default async function generateAnovaRecordsHtml(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method, body } = request;

  if (method === 'POST') {
    const records: Record[] = body.data;

    const htmlBody = records
      .map(record => {
        const calcs = record.calcs
          .map(calc => {
            const calcWithBr = calc.replaceAll('\n', '<br>');

            return `<div class="calc">${calcWithBr}</div>`;
          })
          .join('\n');

        return `<section class="table-calcs">
          <h2>${record.title}</h2>

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
