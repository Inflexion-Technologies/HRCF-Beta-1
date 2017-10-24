var chai = require("chai"),
should = require('should'),
expect = require('chai').expect,
request = require('request'),
d = require('../config'),
url = d.config.IP+':'+d.config.PORT+'/api/',
token = '',
user = {};


chai.should();
chai.use(require('chai-things'));

describe('Users#Check Fields', function(){
    
    before(function(done){
        request({
            uri: url+'utils/adduser',
            method: 'POST',
            json: true,
            body : {firstname : 'Emmanuel', lastname : 'Selby', email : 'selby@hrcf.com', msisdn : '0244000000', password : 'pa55w0rd01', type : 'I'},
        }, function(error, response, body){
            user = body.user;
            token = body.token;
            console.log(user);
            done();
        });	
    });
    
    it('#/ {should have field [status]}', function(){
        expect(user).to.have.property('status');
    }); 
    it('#/ {should have field [firstname]}', function(){
        expect(user).to.have.property('firstname');
    });
    it('#/ {should have field [lastname]}', function(){
        expect(user).to.have.property('lastname');
    });
    it('#/ {should have field [email]}', function(){
        expect(user).to.have.property('email');
    });
    it('#/ {should have field [msisdn]}', function(){
        expect(user).to.have.property('msisdn');
    });
    it('#/ {should have field [status]}', function(){
        expect(user).to.have.property('company_id');
    });
});

// describe('Users#Updating', function(){
    
//     it('do updating', function(done){
//         request({
//             uri: url+'v1/misc/user/1/complete_registration',
//             method: 'PUT',
//             json: true,
//             body : {token: token, primary_account_number : '0090999898878', primary_branch_id : 459, primary_account_name : 'Justina Owusu',
//                     primary_approver_first : 'Gideon', primary_approver_last : 'Kombian', primary_approver_email : 'gideon@gmail.com',
//                     primary_approver_msisdn : '0233909090' },
//         }, function(error, response, body){
//             user = body;
//             console.log(body);
//             done();
//         });	
//     });
    
// });


describe('Banks#Check Fields', function(){

    before(function(done){
        request({
            uri: url+'auth/',
            method: 'GET',
            json: true,
            qs : {username : 'selby@hrcf.com', password : 'pa55w0rd01'},
        }, function(error, response, body){
            token = body.token;
            done();
        });	
    });

    it('#/ {should have field [status]}', function(done){
        request({
            uri: url+'v1/banks/',
            method: 'GET',
            json: true,
            qs : {token : token}

        }, function(error, response, body){
            expect(body).to.all.have.property('status');
            done();
        });	
    }); 

    it('#/ {should have field [name]}', function(done){
        request({
            uri: url+'v1/banks/',
            method: 'GET',
            json: true,
            qs : {token : token}
            
        }, function(error, response, body){
            expect(body).to.all.have.property('name');
            done();
        });	
    });

    it('#/ {should have field [code]}', function(done){
        request({
            uri: url+'v1/banks/',
            method: 'GET',
            json: true,
            qs : {token : token}
            
        }, function(error, response, body){
            expect(body).to.all.have.property('code');
            done();
        });	
    });
});

describe('Branches#Check Fields', function(){
    
    before(function(done){
        request({
            uri: url+'auth/',
            method: 'GET',
            json: true,
            qs : {username : 'selby@hrcf.com', password : 'pa55w0rd01'},
        }, function(error, response, body){
            token = body.token;
            done();
        });	
    });
    
    it('#/ {should have field [status]}', function(done){
        request({
            uri: url+'v1/branches/',
            method: 'GET',
            json: true,
            qs : {token : token}
            
        }, function(error, response, body){
            expect(body).to.all.have.property('status');
            done();
        });	
    }); 

    it('#/ {should have field [name]}', function(done){
        request({
            uri: url+'v1/branches/',
            method: 'GET',
            json: true,
            qs : {token : token}
            
        }, function(error, response, body){
            expect(body).to.all.have.property('name');
            done();
        });	
    });

    it('#/ {should have field [bank_id]}', function(done){
        request({
            uri: url+'v1/branches/',
            method: 'GET',
            json: true,
            qs : {token : token}
            
        }, function(error, response, body){
            expect(body).to.all.have.property('bank_id');
            done();
        });	
    });

    it('#/ {should have field [code]}', function(done){
        request({
            uri: url+'v1/branches/',
            method: 'GET',
            json: true,
            qs : {token : token}
            
        }, function(error, response, body){
            expect(body).to.all.have.property('code');
            done();
        });	
    });
});