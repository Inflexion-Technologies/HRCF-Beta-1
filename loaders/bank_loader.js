var bankData = require('../resources/banks.json');
var _ = require('lodash');
var fs = require('fs');

var banks = [],
    branches = [];

bankData.map((bank)=>{
    // var bank_name = bank.name,
    //     code = bank.code,
    //     branch = bank.branch,
    //     b_code = bank.b_code;

    // var bank = {name : bank_name, code : code};
    
    banks.push(bank.name);
});

//Unique collection

var uniqueBanks = _.uniq(banks),
    dirtyUniqueBanksWithCode = [],
    cleanUniqueBanksWithCode = [],
    bankWithBranches = [],
    tidyBranches = [];


//Grep Uniq Banks with code

uniqueBanks.map((gbank)=>{

   dirtyUniqueBanksWithCode.push(_.find(bankData, (bank)=>{return gbank === bank.name;}));
})

//Reshape the unique bank data
dirtyUniqueBanksWithCode.map((bank, i)=>{
    cleanUniqueBanksWithCode.push({ id : i+1, name : bank.name, code : bank.code});
})

//console.log(JSON.stringify(cleanUniqueBanksWithCode));

//Group Bank and their branches
cleanUniqueBanksWithCode.map((cbank)=>{
   bankWithBranches.push( {id : cbank.id, branches : _.filter(bankData, (bank)=>{return cbank.code === bank.code})});
})

//Replacing the id's
bankWithBranches.map((b)=>{
    
    b.branches.map((branch)=>{
        tidyBranches.push({name : branch.branch, code: branch.branch_code, bank_id : b.id});
    })
})

fs.writeFile('banks.json', JSON.stringify(cleanUniqueBanksWithCode),  function(err) {
    if (err) {
       return console.error(err);
    }
    
    console.log("Banks written successfully!");
 });

fs.writeFile('bank_branches.json', JSON.stringify(tidyBranches),  function(err) {
    if (err) {
       return console.error(err);
    }
    
    console.log("Branches written successfully!");
 });
