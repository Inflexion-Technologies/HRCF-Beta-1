import {Sequelize} from 'sequelize';
import _ from 'lodash';

var utils = require('../services/utils');

export function companyModel(config){
	const company = config.define('company', {
      name: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      reg_number: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue:'A'
      }
	  }, {underscored: true});

	  return company;
}

export function transactionModel(config){
	const transactions = config.define('transaction', {
      type: {
        type: Sequelize.ENUM,
        values : ['W','C','I']
      },
      amount : {
        type : Sequelize.DOUBLE,
        defaultValue : 0
      },
      user_id : {
        type : Sequelize.INTEGER
      },
      narration : {
        type : Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return transactions;
}

export function withdrawalModel(config){
	const withdrawals = config.define('withdrawal', {
      amount: {
        type: Sequelize.DOUBLE
      },
      user_id : {
        type : Sequelize.INTEGER
      },
      account_id:{
        type : Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return withdrawals;
}

export function creditModel(config){
	const credits = config.define('credit', {
      amount: {
        type: Sequelize.DOUBLE
      },
      type : {
        type : Sequelize.ENUM,
        values : ['C','I']
      },
      user_id : {
        type : Sequelize.INTEGER
      },
      bank_id :{
        type : Sequelize.INTEGER
      },
      narration : {
        type : Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return credits;
}

export function bankModel(config){
	const banks = config.define('bank', {
	    name: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('name', _.capitalize(val).trim());
        },
        get() {
          const name = this.getDataValue('name');
          // 'this' allows you to access attributes of the instance

          const nameTokens = name.split(' ');
          if(nameTokens.length === 1){
            return _.capitalize(nameTokens);
          }else{
            let tmpName = '';
            nameTokens.map((n)=>{
              tmpName = tmpName+_.capitalize(n)+' ';
            })

            return tmpName.trim();
          }
        }
      },
      code: {
        type: Sequelize.STRING
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
	  }
	}, {underscored: true});

	return banks;
}

export function idModel(config){
	const ids = config.define('id_type', {
	    name: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('name', _.capitalize(val).trim());
        }
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
	  }
	}, {underscored: true});

	return ids;
}

export function imageMapModel(config){
	const mapper = config.define('id_map', {
	    user_id: {
        type: Sequelize.INTEGER,
      },
      filename : {
        type : Sequelize.STRING
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
	  }
	}, {underscored: true});

	return mapper;
}

export function bankStatementModel(config){
  const bankStatements = config.define('bank_statement', {
      ledger_account : {
        type : Sequelize.STRING
      },
      date : {
        type : Sequelize.DATE
      },
      ic_bank_id : {
        type : Sequelize.INTEGER
      },
      credit : {
        type : Sequelize.DOUBLE
      },
      debit : {
        type : Sequelize.DOUBLE
      },
      fund_code : {
        type : Sequelize.STRING
      },
      client_code : {
        type : Sequelize.STRING,
      },
      currency : {
        type : Sequelize.STRING
      },
      counter_party_code : {
        type : Sequelize.STRING
      },
      sponsor_code : {
        type : Sequelize.STRING
      },
      security_issuer_code : {
        type : Sequelize.STRING
      },
      account_number : {
        type : Sequelize.STRING,
      },
      description : {
        type : Sequelize.STRING,
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
	  }
	}, {underscored: true});

	return bankStatements;
}

export function ICBankModel(config){
	const icbanks = config.define('ic_bank', {
	    name: {
        type: Sequelize.STRING,
        
      },
      account_number: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('account_number',val.trim());
        }
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
	  }
	}, {underscored: true});

	return icbanks;
}

export function branchModel(config){
	const bankBranch = config.define('bank_branch', {
	    name: {
        type: Sequelize.STRING,
        get() {
          const name = this.getDataValue('name');
          // 'this' allows you to access attributes of the instance

          const nameTokens = name.split(' ');
          if(nameTokens.length === 1){
            return _.capitalize(nameTokens);
          }else{
            let tmpName = '';
            nameTokens.map((n)=>{
              tmpName = tmpName+_.capitalize(n)+' ';
            })

            return tmpName.trim();
          }
        }
      },
      code: {
        type: Sequelize.STRING
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue : 'A'
	  }
	}, {underscored: true});

	return bankBranch;
}

export function accountModel(config){
	const account = config.define('account', {
      name : {
        type : Sequelize.STRING
      },
	    user_id: {
        type: Sequelize.INTEGER
      },
      account_number: {
        type: Sequelize.STRING
      },
      bank_branch_id :{
        type : Sequelize.INTEGER
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue : 'A'
	  }
	}, {underscored: true});

	return account;
}

export function requestModel(config){
	const request = config.define('approve_request', {
      uuid : {
        type : Sequelize.UUID,
        defaultValue : Sequelize.UUIDV1
      },
      transaction_code : {
        type : Sequelize.STRING
      },
	    user_id: {
        type: Sequelize.INTEGER
      },
      amount : {
        type : Sequelize.INTEGER
      },
      approver_id : {
        type : Sequelize.INTEGER
      },
      account_id: {
        type: Sequelize.INTEGER
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue : 'P'
	    }
	}, {underscored: true});

	return request;
}

export function forgotModel(config){
	const forgot = config.define('forgot_password', {
      uuid : {
        type : Sequelize.UUID,
        defaultValue : Sequelize.UUIDV1
      },
	    user_id: {
        type: Sequelize.INTEGER
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue : 'P'
	    }
	}, {underscored: true});

	return forgot;
}

export function payoutRequestModel(config){
	const payout_request = config.define('payout_request', {
	    user_id: {
        type: Sequelize.INTEGER
      },
      amount : {
        type : Sequelize.INTEGER
      },
      account_id: {
        type: Sequelize.INTEGER
      },
      request_date : {
        type : Sequelize.DATE
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue : 'P'
	    }
	}, {underscored: true});

	return payout_request;
}

export function trackModel(config){
	const track = config.define('tracker', {
    count: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return track;
}

export function navStoreModel(config){
	const nav = config.define('nav_store', {
    nav: {
      type: Sequelize.INTEGER
    },
    nav_per_unit: {
      type: Sequelize.INTEGER
    },
    gain_loss: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return nav;
}

export function fundAllocationStoreModel(config){
	const fund_allocation = config.define('fund_allocation_store', {
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return fund_allocation;
}

export function fundAllocationCollectionModel(config){
	const fund_allocation_collection = config.define('fund_allocation_collection', {
    fund_allocation_store_id : {
      type : Sequelize.INTEGER
    },
    fund_name: {
      type: Sequelize.STRING
    },
    market_value: {
      type: Sequelize.FLOAT
    },
    aum_percent: {
      type: Sequelize.FLOAT
    },
    asset_class: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return fund_allocation_collection;
}

export function approveModel(config){
	const approvers = config.define('approver', {
      user_id : {
        type : Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('firstname', utils.capitalizeWord(val).trim());
        }
      },
      lastname: {
        type: Sequelize.STRING,
        set(val) {
          if(val !== undefined && val !== null){
            this.setDataValue('lastname', utils.capitalizeWord(val).trim());            
          }else{
            this.setDataValue('lastname', '');                        
          }    
        }
      },
      email: {
        type: Sequelize.STRING,
        validate : {
            isEmail : true
        }, set(val) {
          this.setDataValue('email', (val).trim());
        }
      },
      msisdn: {
        type: Sequelize.STRING,
        validate : {
            isNumeric : true
        }, set(val) {
          this.setDataValue('msisdn', (val).trim());
        }
      },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue : 'A'
	  }
	}, {underscored: true});

	return approvers;
}

export function usersModel(config){
	const users = config.define('user', {
      firstname: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('firstname', utils.capitalizeWord(val).trim());
        }
      },
      lastname: {
        type: Sequelize.STRING,
        set(val) {
          if(val !== undefined && val !== null){
            this.setDataValue('lastname', utils.capitalizeWord(val).trim());            
          }else{
            this.setDataValue('lastname', '');                        
          }
        }
      },
      payment_number: {
        type: Sequelize.STRING,
        unique : true
      },
      email: {
        type: Sequelize.STRING,
        unique : true,
        validate : {
            isEmail : true
        }, set(val) {
          this.setDataValue('email', (val).trim());
        }
      },
      msisdn: {
        type: Sequelize.STRING,
        unique : true,
        validate : {
            isNumeric : true
        }, set(val) {
          this.setDataValue('msisdn', (val).trim());
        }
      },
      available_balance : {
        type : Sequelize.DOUBLE,
        defaultValue : 0
      },
      actual_balance : {
        type : Sequelize.DOUBLE,
        defaultValue : 0
      },
      type: {
        type: Sequelize.ENUM,
        values : ['C','I']
      },
      is_admin:{
        type : Sequelize.ENUM,
        values : ['Y','N'],
        defaultValue : ['N']
      },
      kin:{
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('kin', _.capitalize(val).trim());
        }
      },
      kin_msisdn: {
        type: Sequelize.STRING,
        validate : {
            isNumeric : true
        }, set(val) {
          this.setDataValue('kin_msisdn', (val).trim());
        }
      },
      password: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('password', utils.getHash(val.trim()));
        }
      },
      id_type_id : {
        type : Sequelize.INTEGER
      },
      id_number : {
        type : Sequelize.STRING
      },
	    is_complete: {
        type: Sequelize.BOOLEAN,
        defaultValue : false
	    },
	    status: {
        type: Sequelize.STRING(1),
        defaultValue : 'A'
	  }
  }, {underscored: true});

	return users;
}