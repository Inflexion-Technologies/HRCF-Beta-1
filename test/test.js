var chai = require("chai"),
should = require('should'),
expect = require('chai').expect,
request = require('request'),
d = require('../config'),
url = d.config.IP+':'+d.config.PORT+'/api/v1';

chai.should();
chai.use(require('chai-things'));

describe('Banks#Check Fields', function(){

    // before(function(done){
    //     done();
    // });

        it('#/ {should have field [status]}', function(done){
            request({
                uri: url+'/banks/',
                method: 'GET',
                json: true,
                
            }, function(error, response, body){
                expect(body).to.all.have.property('status');
                done();
            });	
        }); 

        it('#/ {should have field [name]}', function(done){
            request({
                uri: url+'/banks/',
                method: 'GET',
                json: true,
                
            }, function(error, response, body){
                expect(body).to.all.have.property('name');
                done();
            });	
        });

        it('#/ {should have field [code]}', function(done){
            request({
                uri: url+'/banks/',
                method: 'GET',
                json: true,
                
            }, function(error, response, body){
                expect(body).to.all.have.property('code');
                done();
            });	
        });
});

describe('Branches#Check Fields', function(){
    
        // before(function(done){
        //     done();
        // });
    
            it('#/ {should have field [status]}', function(done){
                request({
                    uri: url+'/branches/',
                    method: 'GET',
                    json: true,
                    
                }, function(error, response, body){
                    expect(body).to.all.have.property('status');
                    done();
                });	
            }); 
    
            it('#/ {should have field [name]}', function(done){
                request({
                    uri: url+'/branches/',
                    method: 'GET',
                    json: true,
                    
                }, function(error, response, body){
                    expect(body).to.all.have.property('name');
                    done();
                });	
            });

            it('#/ {should have field [bank_id]}', function(done){
                request({
                    uri: url+'/branches/',
                    method: 'GET',
                    json: true,
                    
                }, function(error, response, body){
                    expect(body).to.all.have.property('bank_id');
                    done();
                });	
            });

            it('#/ {should have field [code]}', function(done){
                request({
                    uri: url+'/branches/',
                    method: 'GET',
                    json: true,
                    
                }, function(error, response, body){
                    expect(body).to.all.have.property('code');
                    done();
                });	
            });
    });