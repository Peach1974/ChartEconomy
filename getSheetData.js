const getSheetData = (options) => {
  const { sheetID, sheetName, query, range, callback } = options;
  
  // Check for the necessary values
  if (!sheetID || !sheetName || !callback) {
      console.error("Missing necessary parameters for getSheetData.");
      return;
  }

  const baseEndpoint = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const endpoint = range ? `${baseEndpoint}&range=${range}` : `${baseEndpoint}&tq=${encodeURIComponent(query)}`;

  console.log("Fetching URL:", endpoint);

  fetch(endpoint)
      .then(response => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          return response.text();
      })
      .then(data => {
        const trimmedData = data.substring(data.indexOf("{"), data.lastIndexOf("}") + 1);
        
        if (!trimmedData || !trimmedData.includes("{") || !trimmedData.includes("}")) {
            throw new Error("Received data doesn't look like valid JSON.");
        }
        
        
        const jsonData = JSON.parse(trimmedData);
        console.log('Parsed JSON data:', jsonData);  // <-- This line logs the parsed JSON data
    
        if (!jsonData.table || !jsonData.table.rows) {
            throw new Error('Unexpected data structure');
        }
        
        const convertedData = responseToObjects(jsonData);

        // Check for a valid callback function before calling it
        if (typeof callback === 'function') {
            callback(convertedData);
        } else {
            console.error('Provided callback is not a function:', callback);
        }
    })
      .catch(error => {
          console.error('Error fetching sheet data:', error.message);
      });

      function responseToObjects(jsonData) {
        let data = [];
        
        if (!jsonData.table || !jsonData.table.rows) {
            console.warn("Unexpected data structure received");
            return data; // Return empty data
        }
    
        const columns = jsonData.table.cols;
        const rows = jsonData.table.rows;
        let rowObject;
        let cellData;
        let propName;
        
        for (let r = 0, rowMax = rows.length; r < rowMax; r++) {
            rowObject = {};
            for (let c = 0, colMax = columns.length; c < colMax; c++) {
                cellData = rows[r]["c"][c];
                propName = columns[c].label;
                if (cellData === null) {
                    rowObject[propName] = "";
                } else if (cellData && typeof cellData["v"] == "string" && cellData["v"].startsWith("Date")) {
                    // Added the cellData safeguard here
                    rowObject[propName] = new Date(cellData["f"]);
                } else {
                    rowObject[propName] = cellData["v"];
                }
            }
            data.push(rowObject);
        }
        return data;
    }
    
};

export default getSheetData;
