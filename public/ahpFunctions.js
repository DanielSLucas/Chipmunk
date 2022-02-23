const RI = [ 0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];

function max(arr) {
  let max;

  arr.forEach((item, i) => {
    if (i === 0) max = item;
    if (item > max) max = item;
  });

  return max;
}

function min(arr) {
  let min;

  arr.forEach((item, i) => {
    if (i === 0) min = item;
    if (item < min) min = item;
  });

  return min;
}

function parseCSV(data) {
  const rows = data.split('\n');

  const parsedCSV = rows.map(row => row.split(','));

  return parsedCSV;
}

function serializeData(data) {
  const dataCopy = Array.from(data);

  const params = data[0];

  dataCopy.shift();

  const attributeValues = {};

  const serializedItems = dataCopy.map(row => {
    const item = {};

    params.forEach((param, i) => {
      const key = param ? param : 'name';
      const value = Number.isNaN(Number(row[i])) ? row[i] : Number(row[i]);


      if (!attributeValues[key]) {
        attributeValues[key] = [value];
      } else {
        attributeValues[key].push(value);
      }


      item[key] = value;
    });

    return item;
  });

  return {
    attributeValues,
    serializedItems
  };
}

function getAttributesInfo(data, attributes) {
  return attributes.map(atrb => {
    const currentAttributeValues = data.attributeValues[atrb.name]
    const highestDif = max(currentAttributeValues) - min(currentAttributeValues);

    const comparisonTable = data.serializedItems.map((opt1) => {
      return data.serializedItems.map((opt2) => {
        return getSaatyScaleGrade(highestDif, opt1[atrb.name], opt2[atrb.name], atrb.betterWhen);
      });
    });

    return {
      ...atrb,
      ...ponderation(comparisonTable)
    }
  });
}

function getSaatyScaleGrade(highestDif, op1Value, op2Value, betterWhen) {
  const saatyScale = [1,3,5,7,9];

  const num = op1Value > op2Value ?  op1Value - op2Value : op2Value - op1Value;

  const grade = (num*9)/highestDif;

  if (saatyScale.includes(grade)) {
    return grade;
  }

  let scaleGrade=1;

  saatyScale.forEach((item, i) => {
    if (grade > item) {
      scaleGrade = saatyScale[i+1]
    }
  });

  if (betterWhen === 'greater' && op1Value < op2Value) {
    return 1/scaleGrade;
  }

  if (betterWhen === 'lesser' && op1Value > op2Value) {
    return 1/scaleGrade;
  }

  return scaleGrade;
}

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

  const consistence = comparisonTable.map((row, i) => {
    let total = 0;

    row.forEach((item, j) => {
      total += item*priorities[j];
    });

    return total/priorities[i];
  });

  const totalConsistence = consistence.reduce((acc, cur) => acc + cur, 0)

  const lambdaMax = totalConsistence/totalNumOfttributes;

  const ci = (lambdaMax - totalNumOfttributes)/ (totalNumOfttributes-1);

  const cr = ci/RI[totalNumOfttributes-1];

  return {
    comparisonTable,
    sums,
    priorities,
    lambdaMax,
    consistence,
    totalConsistence,
    ci,
    cr,
    isConsistent: cr < 0.1,
  };
}


function decide(attributesInfo, ponderationInfo, serializedItems) {
  const attributesPriorities = attributesInfo.map( item => item.priorities);
  const { priorities: ponderationPriorities } = ponderationInfo;

  const final = attributesPriorities.map((param, i) => {
    let total =0;

    attributesPriorities.forEach((item, j) => {
      total += (attributesPriorities[j][i] * ponderationPriorities[j]);
    });
    return total;
  })

  const descisionIndex = final.indexOf(max(final));

  return serializedItems[descisionIndex];
}


function ahp(serializedData, humanInput) {
  const ponderationInfo = ponderation(humanInput.attributesPrioritiesTable);

  const attributesInfo = getAttributesInfo(serializedData, humanInput.attributesInfo);

  const descision = decide(attributesInfo, ponderationInfo, serializedData.serializedItems);

  return descision;
}

module.exports = {
  parseCSV,
  serializeData,
  ahp,
}
