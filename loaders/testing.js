var bankData = require('../resources/banks.json');
var _ = require('lodash');
var fs = require('fs');

showOnlyUniq(bankData, 'name');

function showOnlyUniq(data, field){
    var allValues = [];

    data.map((d)=>{
      return allValues.push(d[field]);
    })

    var uniqFields = _.uniq(allValues);
    
    var filteredData = [];

    uniqFields.map((d)=>{
        const found = data.find((ld)=>{return ld[field] === d});
        if(found){
            filteredData.push(found);
        }
    });

    console.log('Filtered Data => '+JSON.stringify(filteredData));

    return filteredData;
}
