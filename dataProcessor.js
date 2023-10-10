// Function to process and export the data
function processData(csvFilePath) {
  return new Promise((resolve, reject) => {
    fetch(csvFilePath)
      .then(response => response.text())
      .then(data => {
        let modifiedData = data.split('\n').slice(1).join('\n');
        Papa.parse(modifiedData, {
          header: true,
          complete: (result) => {
            const data = result.data;
            const columns = values = [
              "Timestamp",
              "POW.AF3.Alpha",
              "POW.AF3.BetaH",
              "POW.AF3.BetaL",
              "POW.AF3.Gamma",
              "POW.AF3.Theta",
              "POW.AF4.Alpha",
              "POW.AF4.BetaH",
              "POW.AF4.BetaL",
              "POW.AF4.Gamma",
              "POW.AF4.Theta",
              "POW.Pz.Alpha",
              "POW.Pz.BetaH",
              "POW.Pz.BetaL",
              "POW.Pz.Gamma",
              "POW.Pz.Theta",
              "POW.T7.Alpha",
              "POW.T7.BetaH",
              "POW.T7.BetaL",
              "POW.T7.Gamma",
              "POW.T7.Theta",
              "POW.T8.Alpha",
              "POW.T8.BetaH",
              "POW.T8.BetaL",
              "POW.T8.Gamma",
              "POW.T8.Theta"
            ]


            let firstTimestamp = null;

            const valuesFromColumns = data.map((row) => {
              const rowData = {};

              if (row["POW.AF3.Alpha"] !== '') {
                columns.forEach((column) => {
                  if (column === 'Timestamp') {
                    if (firstTimestamp === null) {
                      firstTimestamp = parseFloat(row[column]);
                    }
                    rowData[column] = (parseFloat(row[column]) - firstTimestamp).toFixed(3);
                  } else {

                    rowData[column] = row[column];
                  }
                });
              }
              return rowData;
            });

            const filteredData = valuesFromColumns.filter((row) => {
              return Object.keys(row).length !== 0
            })


            //average
            function accumulateRow(row, freqType) {
              let sum = 0
              const rowAsArray = Object.entries(row)
              rowAsArray.forEach(item => {
                if (item[0].includes(freqType) && item[1]) {
                  sum += Number(item[1])
                }
              })
              return sum.toString()
            }


            const accValueData = filteredData.map((row) => {
              return (
                { timestamp: row.Timestamp, alpha: accumulateRow(row, 'Alpha'), betaL: accumulateRow(row, 'BetaL'), betaH: accumulateRow(row, 'BetaH'), gamma: accumulateRow(row, 'Gamma'), theta: accumulateRow(row, 'Theta') }
              )
            })

            resolve(accValueData)
          },
        });
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error)
      });
  })
}
