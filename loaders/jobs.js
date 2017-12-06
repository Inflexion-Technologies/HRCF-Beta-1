
var models = require('./native_models');
var d = require('../config');
var request = require('request');
var dateFormat = require('dateformat');


if(process.argv !== undefined && process.argv.length === 3){
    switch(process.argv[2]){
        case 'full-month' : {
            let dates = getWholeMonth();
            getNAV(dates);
            getFundAllocation(dates);
            
            setTimeout(function(){
                updatePriceChange();                
            }, 20*1000)

            break;
        }

        case 'last-week' : {
            let dates = getLastWeek();

            getNAV(dates);
            getFundAllocation(dates);

            setTimeout(function(){
                updatePriceChange();                
            }, 20*1000)
            break;
        }

        case 'last-year' : {
            let dates = getAYearAgo();

            getNAV(dates);
            getFundAllocation(dates);

            setTimeout(function(){
                updatePriceChange();                
            }, 20*1000)
            break;
        }

        default : {

        }
    }
}else{
    //getWholeMonth();
    getNAV();
    getFundAllocation();
}

function getWholeMonth(){
    var day = new Date().getDate();
    var month = new Date().getMonth()+1;
    var year = new Date().getFullYear();

    if((month+'').length === 1){
        month = '0'+month;
    }

    var calendar = [];

    for(var i=1; i<=day; i++){
        let day = i+'';

        if(day.length === 1){
            day = '0'+i;
        }

        let date = year+'-'+month+'-'+day;
        let formatted = dateFormat(new Date(date), 'yyyy-mm-dd');
        
        calendar.push(formatted);
    }

    console.log('Whole Month Calendar => '+calendar);    
    return calendar;
}

function getLastWeek(){   
    var calendar = [];

    for(var i=1; i<=8; i++){
        let date = new Date().setDate(new Date().getDate()-i);
        let formatted_date = dateFormat(date, 'yyyy-mm-dd');

        calendar.push(formatted_date);
    }

    console.log('Last Week Calendar => '+calendar);    
    return calendar;
}

function getAYearAgo(){
    var calendar = [];

    for(var i=1; i<=365; i++){
        let date = new Date().setDate(new Date().getDate()-i);
        let formatted_date = dateFormat(date, 'yyyy-mm-dd');

        calendar.push(formatted_date);
    }

    console.log('Last Week Calendar => '+calendar);    
    return calendar;
}

function creditAllUsers(assume_nav,date){    
    const dbConfig = d.sequelize;        
    const usersModel = models.usersModel(dbConfig);
    const creditModel = models.creditModel(dbConfig);
    const transaction = models.transactionModel(dbConfig);


    usersModel.sum('actual_balance', {where :{status : 'A'}}).then((totalActualBalance)=>{
        if(parseFloat(totalActualBalance) > 0){
            const nav = (parseFloat(assume_nav) - parseFloat(totalActualBalance));
            if(nav < 1) return;

            usersModel.findAll({ where : {status : 'A'}}).then((users)=>{
                users.map((user)=>{
                    const interest = (parseFloat(user.actual_balance)/parseFloat(totalActualBalance))*parseFloat(nav);
                    user.increment({'actual_balance': interest});
                    user.increment({'available_balance': interest})                        
                    .then((user)=>{
                        if(user){
                            creditModel.create({amount : interest, 
                                type : 'I', 
                                user_id: user.id, 
                                narration: 'Interest',
                                date : date});
                            transaction.create({type : 'I', 
                                amount : interest, 
                                user_id : user.id, 
                                narration : 'Interest',
                                date : date});
                        }
                    })
                })
            })
        }
    })   
}

function saveNAV(payload, date){
    const dbConfig = d.sequelize;        
    const navStoreModel = models.navStoreModel(dbConfig);

    navStoreModel.create({nav : payload.nav,
                    nav_per_unit : payload.navPerUnit, 
                    gain_loss : payload.gainLoss,
                    per_change : 0,
                    date : date})
  
}

function updatePriceChange(){
    const dbConfig = d.sequelize;        
    const navStoreModel = models.navStoreModel(dbConfig);

    return navStoreModel.findAll({where : {status : 'A'}})
        .then((navs)=>{
            if(navs){
               return navs;
            }

        })
        .then(function(navs){
            const len = navs.length;
            var chgList = [];
            for(var i=1; i<len; i++){

                var iDay = dateFormat(new Date().setDate(new Date().getDate() - i), 'dd-mm-yyyy');
                var current_nav = {};

                navs.map(function(nav){
                    
                    let tmpDate = dateFormat(new Date(nav.date), 'dd-mm-yyyy');
                    
                    if(iDay === tmpDate){
                        current_nav = nav;
                    }
                });

                console.log('Current Nav '+JSON.stringify(current_nav))


                var i2Day = dateFormat(new Date().setDate(new Date().getDate() - (i+1)), 'dd-mm-yyyy');
                var last_nav = {};

                navs.find(function(nav){
                    
                    let tmpDate = dateFormat(new Date(nav.date), 'dd-mm-yyyy');
                    if(i2Day === tmpDate){
                        last_nav = nav;
                    }
                });

                console.log('Last Nav '+JSON.stringify(last_nav))
                

                if(current_nav === undefined || last_nav === undefined){
                    continue;
                }

                var chg = ((current_nav.nav/last_nav.nav) - 1)*100;   
                
                if(isNaN(chg) || chg === NaN || chg === null){
                    continue;
                }
                
                chgList.push({id: current_nav.id, change : chg});
                console.log('Change '+chg);
            }

            chgList.map(function(data){
                return navStoreModel.findOne({where : {id : data.id, status : 'A'}})
                .then((nav)=>{
                    if(nav){
                        nav.update({per_change : data.change});
                        return nav;
                    }
                })
            })
        })
}

function saveFundAllocationData(data, date){
    const dbConfig = d.sequelize;
    const fundAllocationStoreModel = models.fundAllocationStoreModel(dbConfig);
    const fundAllocationCollectionModel = models.fundAllocationCollectionModel(dbConfig);

    if(data.length > 0){

        fundAllocationStoreModel.create({date : date, status : 'A'})
        .then((store)=>{
            if(store){
                data.map((d)=>{
                    fundAllocationCollectionModel.create({
                        fund_allocation_store_id : store.id,
                        fund_name : d.fundName,
                        market_value : d.marketValue,
                        aum_percent : d.aumPercent,
                        asset_class : d.assetClass,
                        date : date
                    })
                })
            }
        })
    }
}

function getFundAllocation(dates){

    if(dates){
        dates.map(function(date){
            var dateFormat = require('dateformat');
            
            let url = d.config.ams_fund_allocation+dateFormat(date, 'dd-mm-yyyy');
            let request = require('request');
            
            console.log('FUNDS URL '+url);    
            
            request({
                uri: url,
                method: 'GET',
                json: true,
            }, function(error, res, body){
                console.log("Asset Allocation "+JSON.stringify(body.payload));
                if(body !== undefined && body.payload && body.statusCode === 'successful'){
                    saveFundAllocationData(body.payload, date);                
                }else{
                    console.log('body.payload => '+body.payload);
                }
            });	
        });
    }else{
        var app = this;
        var request = require('request'),
        dateFormat = require('dateformat'),
        yesterday = new Date().setDate(new Date().getDate()-1),
        yesterday_formatted = dateFormat(yesterday, 'dd-mm-yyyy'),
        //today_formatted = dateFormat(new Date(), 'dd-mm-yyyy'),
        
        url = d.config.ams_fund_allocation;
    
        console.log('Date => '+url);
    
        request({
            uri: url+yesterday_formatted,
            method: 'GET',
            json: true,
        }, function(error, res, body){
            console.log("Asset Allocation "+JSON.stringify(body.payload));
            if(body !== undefined && body.payload && body.statusCode === 'successful'){
                saveFundAllocationData(body.payload, yesterday_formatted);                
            }else{
                console.log('body.payload => '+body.payload);
            }
        });	
    }
}

function getNAV(dates){

    if(dates){
        dates.map(function(date){
            var dateFormat = require('dateformat');
            
            let url = d.config.ams+dateFormat(date, 'dd-mm-yyyy');
            let request = require('request');
            

            console.log('NAV URL '+url);    
            
            request({
                uri: url,
                method: 'GET',
                json: true,
            }, function(error, res, body){
                if(body !== undefined && body.payload && body.statusCode === 'successful'){
                    console.log('Nav came => '+JSON.stringify(body.payload));
                    //creditAllUsers(body.payload.nav, date);
                    saveNAV(body.payload, date);
                }
                
            });

            //require('sleep').sleep(5);
        })
    }else{
        var app = this;
        var request = require('request'),
        dateFormat = require('dateformat'),
        yesterday = new Date().setDate(new Date().getDate()-1),
        yesterday_formatted = dateFormat(yesterday, 'dd-mm-yyyy'),
        //today_formatted = dateFormat(new Date(), 'dd-mm-yyyy'),
        url = d.config.ams;

        console.log('Date => '+url+yesterday_formatted);    

        request({
            uri: url+yesterday_formatted,
            method: 'GET',
            json: true,
        }, function(error, res, body){
            if(body !== undefined && body.payload && body.statusCode === 'successful'){
                //creditAllUsers(body.payload.nav, date);
                saveNAV(body.payload, date);
            }
            
        });	
    }
}