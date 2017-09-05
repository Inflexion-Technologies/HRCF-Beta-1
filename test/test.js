var chai = require("chai"),
should = require('should'),
expect = require('chai').expect,
request = require('request'),
d = require('../config'),
url = d.config.IP+':'+d.config.PORT+'/api/v1';

chai.should();
chai.use(require('chai-things'));

describe('Managers# [init]', function(){
    
        before(function(done){

            const manager = {firstname : 'Justin', lastname: 'Blake', password: 'password', email: 'justin@insyt.co', msisdn: '0243232323'};
            var saved_manager = {};
    
            it('#/ [POST] should be an object', function(done){
                request({
                    uri: url+'/managers/',
                    method: 'POST',
                    data: manager,
                    json: true,
                    
                }, function(error, response, body){
                    console.log(JSON.stringify('body ::: '+body));
                    saved_manager = body;
                    expect(body).to.be.an('object');
                    done();
                });	
            }); 


            done();
        }); 
});

describe('Managers#Check Fields', function(){

    before(function(done){
        done();
    });

        it('#/ {should have field [status]}', function(done){
            request({
                uri: url+'/managers/',
                method: 'GET',
                json: true,
                
            }, function(error, response, body){
                expect(body).to.all.have.property('status');
                done();
            });	
        }); 

        it('#/ {should have field [firstname]}', function(done){
            request({
                uri: url+'/managers/',
                method: 'GET',
                json: true,
                
            }, function(error, response, body){
                expect(body).to.all.have.property('firstname');
                done();
            });	
        });

        it('#/ {should have field [lastname]}', function(done){
            request({
                uri: url+'/managers/',
                method: 'GET',
                json: true,
                
            }, function(error, response, body){
                expect(body).to.all.have.property('lastname');
                done();
            });	
        });

});

describe('Managers#CHECK TYPES', function(){
    
        before(function(done){
            done();
        });
    
            it('#/1 {should return an object}', function(done){
                request({
                    uri: url+'/managers/1',
                    method: 'GET',
                    json: true,
                    
                }, function(error, response, body){
                    expect(body).to.be.an('object');
                    done();
                });	
            }); 

            it('#/1 {[firstname] should be a string}', function(done){
                request({
                    uri: url+'/managers/1',
                    method: 'GET',
                    json: true,
                    
                }, function(error, response, body){
                    expect(body.firstname).to.be.a('string');
                    done();
                });	
            }); 
    
            it('#/1 {[lastname] should be a string}', function(done){
                request({
                    uri: url+'/managers/1',
                    method: 'GET',
                    json: true,
                    
                }, function(error, response, body){
                    expect(body.lastname).to.be.a('string');
                    done();
                });	
            });  
});

