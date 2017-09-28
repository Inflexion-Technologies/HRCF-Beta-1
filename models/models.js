import {Sequelize, DataTypes} from 'sequelize';
import _ from 'lodash';

var utils = require('../services/utils');

export function companyModel(config){
	const company = config.define('companys', {
      name: {
        type: DataTypes.STRING
      },
      location: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING(1),
        defaultValue:'A'
      }
	  }, {underscored: true});

	  return company;
}

export function transactionModel(config){
	const transactions = config.define('transactions', {
      type: {
        type: DataTypes.STRING,
        values : ['W','C']
      },
      amount : {
        type : DataTypes.DOUBLE,
        defaultValue : 0
      },
      user_id : {
        type : DataTypes.INTEGER
      },
      narration : {
        type : DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return transactions;
}

export function withdrawalModel(config){
	const withdrawals = config.define('withdrawals', {
      amount: {
        type: DataTypes.DOUBLE
      },
      narration : {
        type : DataTypes.STRING
      },
      user_id : {
        type : DataTypes.INTEGER
      },
      status: {
        type: DataTypes.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return withdrawals;
}

export function creditModel(config){
	const credits = config.define('credits', {
      amount: {
        type: DataTypes.DOUBLE
      },
      type : {
        type : DataTypes.ENUM,
        values : ['C','I']
      },
      user_id : {
        type : DataTypes.INTEGER
      },
      bank_id :{
        type : DataTypes.INTEGER
      },
      narration : {
        type : DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return credits;
}

export function bankModel(config){
	const banks = config.define('banks', {
	    name: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('name', _.capitalize(val).trim());
        }
      },
      code: {
        type: DataTypes.STRING
      },
	    status: {
        type: DataTypes.STRING(1),
        defaultValue: 'A'
	  }
	}, {underscored: true});

	return banks;
}

export function idModel(config){
	const ids = config.define('id_types', {
	    name: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('name', _.capitalize(val).trim());
        }
      },
	    status: {
        type: DataTypes.STRING(1),
        defaultValue: 'A'
	  }
	}, {underscored: true});

	return ids;
}

export function bankStatementModel(config){
  const bankStatements = config.define('bank_statements', {
      ledger_account : {
        type : DataTypes.STRING
      },
      credit : {
        type : DataTypes.DOUBLE
      },
      debit : {
        type : DataTypes.DOUBLE
      },
      counterparty_code : {
        type : DataTypes.STRING,
      },
      account_number : {
        type : DataTypes.STRING,
      },
      description : {
        type : DataTypes.STRING,
      },
      sponsor_code : {
        type : DataTypes.STRING,
      },
      client_code : {
        type : DataTypes.STRING,
      },
	    status: {
        type: DataTypes.STRING(1),
        defaultValue: 'A'
	  }
	}, {underscored: true});

	return bankStatements;
}

export function ICBankModel(config){
	const icbanks = config.define('ic_banks', {
	    name: {
        type: DataTypes.STRING,
        
      },
      account_number: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('account_number',val.trim());
        }
      },
	    status: {
        type: DataTypes.STRING(1),
        defaultValue: 'A'
	  }
	}, {underscored: true});

	return icbanks;
}

export function branchModel(config){
	const bankBranch = config.define('bank_branches', {
	    name: {
        type: DataTypes.STRING
      },
      code: {
        type: DataTypes.STRING
      },
	    status: {
        type: DataTypes.STRING(1),
        defaultValue : 'A'
	  }
	}, {underscored: true});

	return bankBranch;
}

export function trackModel(config){
	const track = config.define('trackers', {
    count: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return track;
}

export function approveModel(config){
	const approvers = config.define('approvers', {
      firstname: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('firstname', _.capitalize(val).trim());
        }
      },
      lastname: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('lastname', _.capitalize(val).trim());
        }
      },
      email: {
        type: DataTypes.STRING,
        unique : true,
        validate : {
            isEmail : true
        }, set(val) {
          this.setDataValue('email', (val).trim());
        }
      },
      msisdn: {
        type: DataTypes.STRING,
        unique : true,
        validate : {
            isNumeric : true
        }, set(val) {
          this.setDataValue('msisdn', (val).trim());
        }
      },
	    status: {
        type: DataTypes.STRING(1),
        defaultValue : 'A'
	  }
	}, {underscored: true});

	return approvers;
}

export function usersModel(config){
	const users = config.define('users', {
      firstname: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('firstname', _.capitalize(val).trim());
        }
      },
      lastname: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('lastname', _.capitalize(val).trim());
        }
      },
      payment_number: {
        type: DataTypes.STRING,
        unique : true
      },
      email: {
        type: DataTypes.STRING,
        unique : true,
        validate : {
            isEmail : true
        }, set(val) {
          this.setDataValue('email', (val).trim());
        }
      },
      msisdn: {
        type: DataTypes.STRING,
        unique : true,
        validate : {
            isNumeric : true
        }, set(val) {
          this.setDataValue('msisdn', (val).trim());
        }
      },
      balance : {
        type : DataTypes.DOUBLE,
        defaultValue : 0
      },
      type: {
        type: DataTypes.ENUM,
        values : ['C','I']
      },
      is_admin:{
        type : DataTypes.ENUM,
        values : ['Y','N'],
        defaultValue : ['N']
      },
      kin:{
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('kin', _.capitalize(val).trim());
        }
      },
      kin_msisdn: {
        type: DataTypes.STRING,
        validate : {
            isNumeric : true
        }, set(val) {
          this.setDataValue('kin_msisdn', (val).trim());
        }
      },
      password: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('password', utils.getHash(val.trim()));
        }
	    },
	    is_complete: {
        type: DataTypes.BOOLEAN,
        defaultValue : false
	    },
	    status: {
        type: DataTypes.STRING(1),
        defaultValue : 'A'
	  }
  }, {underscored: true});

	return users;
}