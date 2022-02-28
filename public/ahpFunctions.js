/**
 * Random index based on array order
 */
const RI = [ 0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];

/**
 * Returns the greatest number in an array of numbers.
 * @param {number[]} arr - An array of numbers.
 * @returns {number} The greatest number in the provided array.
 */
function max(arr) {
  let greatestNum;

  arr.forEach((item, i) => {
    if (i === 0) greatestNum = item;
    if (item > greatestNum) greatestNum = item;
  });

  return greatestNum;
}

/**
 * Returns the smallest number in an array of numbers.
 * @param {number[]} arr - An array of numbers.
 * @returns {number} The smallest number in the provided array.
 */
function min(arr) {
  let smallestNum;

  arr.forEach((item, i) => {
    if (i === 0) smallestNum = item;
    if (item < smallestNum) smallestNum = item;
  });

  return smallestNum;
}

/**
 * Parses a csv file into an array.
 * @param {string} data - The path to the file.
 * @returns {any[][]} Array containing the csv data.
 */
function parseCSV(data) {
  const rows = data.split('\n');

  const parsedCSV = rows.map(row => row.split(','));

  return parsedCSV;
}

/**
 * Object containing the serialized data from a table.
 * @typedef {Object} SerializedData
 * @property {Object} attributesValues - Contains an array of values for each attribute of the original table.
 * @property {Object[]} serializedItems - An array containing table rows serialized as an object.
 */

/**
 * Serializes data from a array (table), returning an object with all the values
 * for each attribute and each row serialized as an object.
 * @param {any[][]} data - Array containing the table data to be serialized.
 * @returns {SerializedData} Object containing the serialized data from a table.
 */
function serializeData(data) {
  const dataCopy = Array.from(data);

  const params = data[0];

  dataCopy.shift();

  const attributesValues = {};

  const serializedItems = dataCopy.map(row => {
    const item = {};

    params.forEach((param, i) => {
      const key = param ? param : 'name';
      const value = Number.isNaN(Number(row[i])) ? row[i] : Number(row[i]);


      if (!attributesValues[key]) {
        attributesValues[key] = [value];
      } else {
        attributesValues[key].push(value);
      }


      item[key] = value;
    });

    return item;
  });

  return {
    attributesValues,
    serializedItems
  };
}

/**
 * Object containing attribute info
 * @typedef {Object} Attribute
 * @property {string} name - Attribute name
 * @property {'greater' | 'lesser'} betterWhen - Tell when the attribute is better
 */

/**
 * Get the ponderation for each attribute informed
 * @param {SerializedData} data - Array containing the table data to be serialized.
 * @param {Attribute[]} attributes - Array containing attributes info
 * @returns {(Attribute & PonderationResults)[]} An array with de ponderation info for each attribute informed.
 */
function getAttributesInfo(data, attributes) {
  return attributes.map(atrb => {
    const currentAttributeValues = data.attributesValues[atrb.name]
    const highestDif = max(currentAttributeValues) - min(currentAttributeValues);

    const comparisonTable = data.serializedItems.map((opt1) => {
      return data.serializedItems.map((opt2) => {
        return getSaatyScaleScore(highestDif, opt1[atrb.name], opt2[atrb.name], atrb.betterWhen);
      });
    });

    return {
      ...atrb,
      ...ponderation(comparisonTable)
    }
  });
}

/**
 * Compares two options and gives the score based on the saaty scale.
 * @param {number} highestDif - The best option value minus the worst option value.
 * @param {number} op1Value - Option one value.
 * @param {number} op2Value - Option two value.
 * @param {'greater' | 'lesser'} betterWhen - Tells if the attribute value that is beeing compared is better when lesser or greater.
 * @returns {number} The score based on the saaty scale.
 */
function getSaatyScaleScore(highestDif, op1Value, op2Value, betterWhen) {
  const saatyScale = [1,3,5,7,9];

  const num = op1Value > op2Value ?  op1Value - op2Value : op2Value - op1Value;

  const score = (num*9)/highestDif;

  let saatyScaleScore=1;

  saatyScale.forEach((item, i) => {
    if (score > item) {
      saatyScaleScore = saatyScale[i+1]
    }
  });

  if (betterWhen === 'greater' && op1Value < op2Value) {
    return 1/saatyScaleScore;
  }

  if (betterWhen === 'lesser' && op1Value > op2Value) {
    return 1/saatyScaleScore;
  }

  return saatyScaleScore;
}

/**
 * Object with all the properties returned from ponderation function.
 * @typedef {Object} PonderationResults
 * @property {number[][]} comparisonTable - Table with comparisons between provided options.
 * @property {number[]} sums - The sum total for each column of the comparisonTable.
 * @property {number[]} priorities - The priority from each item (row) in the comparisonTable.
 * @property {number} lambdaMax - The result of the division of the totalConsistency by the number of attributes beeing compared.
 * @property {number[]} consistency - The result of dividing the priority of each row of the 'comparisonTable' by the sum of multiplying each item (of the respective row) by its priority.
 * @property {number} totalConsistency - The sum of all consistencies.
 * @property {number} ci - Consistency index, the result of dividing the lambdaMax minus the number of attributes by the number of attributes minus 1.
 * @property {number} cr - Consistency ratio, the result of dividing the CI by the RI (ramdom index - based in the array order).
 * @property {boolean} isConsistent - Tells if the result is consitent.
 */

/**
 * Do all the math for the given comparison table.
 * @param {any[][]} comparisonTable
 * @returns {PonderationResults} Object with all the properties returned from ponderation function.
 */
function ponderation (comparisonTable) {
  const totalNumOfttributes = comparisonTable[0].length;

  const sums = comparisonTable.map((row, i) => {
    let sum = 0;

    row.forEach((item, j) => {
      sum += comparisonTable[j][i];
    });

    return sum;
  })

  const priorities = comparisonTable.map((row) => {
    let total = 0;
    row.forEach((item, j) => {
      total += item/sums[j];
    });

    const result = total/row.length;

    return result;
  });

  const consistency = comparisonTable.map((row, i) => {
    let total = 0;

    row.forEach((item, j) => {
      total += item*priorities[j];
    });

    return total/priorities[i];
  });

  const totalConsistency = consistency.reduce((acc, cur) => acc + cur, 0)

  const lambdaMax = totalConsistency/totalNumOfttributes;

  const ci = (lambdaMax - totalNumOfttributes)/ (totalNumOfttributes-1);

  const cr = ci/RI[totalNumOfttributes-1];

  return {
    comparisonTable,
    sums,
    priorities,
    lambdaMax,
    consistency,
    totalConsistency,
    ci,
    cr,
    isConsistent: cr < 0.1,
  };
}

/**
 * Decision result
 * @param {*} priorities
 * @param {*} ponderationInfo
 * @param {*} serializedItems
 * @returns
 */

/**
 * Decides, based on the inputs, which option is the best.
 * @param {PonderationResults[]} attributesInfo - The ponderation info for each attribute.
 * @param {PonderationResults} ponderationInfo - The ponderation info for the human input.
 * @param {SerializedData["serializedItems"]} serializedItems - The list of the options serialized as an object.
 * @returns {Object[]} An array ordered by priority, starting by the best decision to the worst.
 */
function decide(attributesInfo, ponderationInfo, serializedItems) {
  const attributesPriorities = attributesInfo.map( item => item.priorities);
  const { priorities: ponderationPriorities } = ponderationInfo;

  const finalPriorities = attributesPriorities.map((param, i) => {
    let total =0;

    attributesPriorities.forEach((item, j) => {
      total += (attributesPriorities[j][i] * ponderationPriorities[j]);
    });
    return total;
  })

  const decisionIndex = finalPriorities.indexOf(max(finalPriorities));

  const itemsWithPrioties = serializedItems.map((item, i) => {
    return {
      ...item,
      priority: finalPriorities[i],
      isTheBestDecision: decisionIndex === i,
    }
  });

  const itemsSortedByPriority = itemsWithPrioties.sort((a,b) => b.priority - a.priority);

  return itemsSortedByPriority;
}

/**
 * Info that must be informed by some one.
 * @typedef {Object} HumanInput
 * @property {number[][]} attributesPrioritiesTable
 * @property {Attribute[]} attributes
 */


/**
 * Uses AHP (Analytic Hierarchy Process) to make a decision based on the data
 * provided and human input.
 * @param {any[][]} data
 * @param {HumanInput} humanInput
 * @returns {Object[]} An array ordered by priority, starting by the best decision to the worst.
 */
function ahp(serializedData, humanInput) {
  const ponderationInfo = ponderation(humanInput.attributesPrioritiesTable);

  const attributesInfo = getAttributesInfo(serializedData, humanInput.attributes);

  const decision = decide(attributesInfo, ponderationInfo, serializedData.serializedItems);

  return decision;
}

module.exports = {
  parseCSV,
  serializeData,
  ahp,
}
