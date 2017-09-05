const _ = require('lodash');

exports.getHash = function(password){
    const crypto = require('crypto');
    const secret = 'thequickfoxjumpedoverthelazydog';
    const hash = crypto.createHmac('sha256', secret)
                   .update(password)
                   .digest('hex');
    return hash;
}

exports.isValidEmail = function(email){
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

exports.isValidMSISDN = function(msisdn){
    if(msisdn.length === 10){
        const tmpText = _.toArray(msisdn);
        const result = _.map(tmpText, (it)=>{
            if(!(_.toUpper(it) === _.toLower(it))){
                console.log('Text contains alphabets');
                return false;
            }
        })

        return !(_.includes(result, false));
    }else{
        return false;
    }
}