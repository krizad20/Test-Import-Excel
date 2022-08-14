var csvjsonConverter = (csvdata, delimiter) => {
    //This array will store the each of the patterns from the regular expression below.
    let arrmatch = [];

    //This array will store the data from the CSV.
    let array = [[]];

    //Stores matched values for quoted values.
    let quotevals = "";

    //Storing JSON array
    let jsonarray = [];

    //Increment value
    let k = 0;

    //Uses regular expression to parse the CSV data and determines if any values has their own quotes in case if any
    // delimiters are within.
    let regexp = new RegExp(("(\\" + delimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");

    //This will loop to find any matchings with the regular expressions.
    while (arrmatch = regexp.exec(csvdata)) {
        //This will determine what the delimiter is.
        let delimitercheck = arrmatch[1];
        //Matches the delimiter and determines if it is a row delimiter and matches the values to the first rows.
        //If it reaches to a new row, then an empty array will be created as an empty row in array.
        if ((delimitercheck !== delimiter) && delimitercheck.length) {
            array.push([]);
        }

        //This determines as to what kind of value it is whether it has quotes or not for these conditions.
        if (arrmatch[2]) {
            quotevals = arrmatch[2].replace('""', '\"');
        }
        else {
            quotevals = arrmatch[3];
        }

        //Adds the value from the data into the array
        array[array.length - 1].push(quotevals);
    }



    //This will parse the resulting array into JSON format
    for (let i = 0; i < array.length - 1; i++) {
        jsonarray[i - 1] = {};
        for (let j = 0; j < array[i].length && j < array[0].length; j++) {
            let key = array[0][j];
            jsonarray[i - 1][key] = array[i][j]
        }
    }

    console.log(jsonarray)


    //This will determine what the properties of each values are from the JSON
    //such as removing quotes for integer value.
    for (k = 0; k < jsonarray.length; k++) {
        let jsonobject = jsonarray[k];
        for (let prop in jsonobject) {
            if (!isNaN(jsonobject[prop]) && jsonobject.hasOwnProperty(prop)) {
                jsonobject[prop] = +jsonobject[prop];
            }
        }
    }

    //This will stringify the JSON and formatting it.
    let formatjson = JSON.stringify(jsonarray, null, 2);

    //Returns the converted result from CSV to JSON
    return jsonarray;
};

var exceljsonConverter = (data) => {

    let exceljson;
    var xlsxflag = true; /*Flag for checking whether excel is .xls format or .xlsx format*/

    /*Converts the excel data in to object*/
    if (xlsxflag) {
        var workbook = XLSX.read(data, { type: 'binary' });
    }
    else {
        var workbook = XLS.read(data, { type: 'binary' });
    }
    /*Gets all the sheetnames of excel in to a variable*/
    let sheet_name_list = workbook.SheetNames;
    let cnt = 0
    sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
        /*Convert the cell value to Json*/
        if (xlsxflag) {
            exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
        }
        else {
            exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
        }

        if (exceljson.length > 0 && cnt == 0) {

            cnt++;
        }
    });
    //Returns the converted result from CSV to JSON
    return exceljson;
};

var Calexceljson = (exceljson) => {
    let columnSet = [];
    let columnSum = [];
    var rowHash = exceljson[0];
    for (var key in rowHash) {
        if (rowHash.hasOwnProperty(key)) {
            if ($.inArray(key, columnSet) == -1) {/*Adding each unique column names to a variable array*/
                columnSet.push(key);
                columnSum.push(0);
            }
        }
    }

    console.log(columnSet)
    for (var i = 0; i < exceljson.length; i++) {
        for (let j = 1; j < columnSet.length; j++) {
            const element = exceljson[i][columnSet[j]];
            columnSum[0] += parseInt(element);
            columnSum[j] += parseInt(element);
        }
    }
    
    console.log(columnSum)
    return columnSum
}

