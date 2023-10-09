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
    
              const columnsToAccess = ['Timestamp', 'EEG.AF3', 'EEG.T7', 'EEG.Pz', 'EEG.T8', 'EEG.AF4'];
              let firstTimestamp = null;
    
              const valuesFromColumns = data.map((row) => {
                const rowData = {};
                columnsToAccess.forEach((column) => {
                  if (column === 'Timestamp') {
                    // Convert the Unix timestamp to time interval (in seconds) relative to the first row as a floating-point number
                    if (firstTimestamp === null) {
                      firstTimestamp = parseFloat(row[column]);
                    }
                    rowData[column] = (parseFloat(row[column]) - firstTimestamp).toFixed(3);
                  } else {
                    rowData[column] = row[column];
                  }
                });
                return rowData;
              });
    
              resolve(valuesFromColumns)
            },
          });
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error)
        });
    })
  }
  