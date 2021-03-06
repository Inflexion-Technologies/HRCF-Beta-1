var Sequelize = require('sequelize');
var _ = require('lodash');

var utils = require('../services/utils');

exports.companyModel = function(config){
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

exports.transactionModel = function(config){
	const transactions = config.define('transaction', {
      type: {
        type: Sequelize.ENUM,
        values : ['W','C','I']
      },
      amount : {
        type : Sequelize.FLOAT,
        defaultValue : 0
      },
      user_id : {
        type : Sequelize.INTEGER
      },
      narration : {
        type : Sequelize.STRING
      },
      date :{
        type : Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return transactions;
}

exports.withdrawalModel = function(config){
	const withdrawals = config.define('withdrawal', {
      amount: {
        type: Sequelize.FLOAT
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

exports.creditModel = function(config){
	const credits = config.define('credit', {
      amount: {
        type: Sequelize.FLOAT
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
      date :{
        type : Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return credits;
}

exports.bankModel = function(config){
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

exports.idModel = function(config){
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

exports.imageMapModel = function(config){
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

exports.bankStatementModel = function(config){
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
        type : Sequelize.FLOAT
      },
      debit : {
        type : Sequelize.FLOAT
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

exports.ICBankModel = function(config){
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

exports.branchModel = function(config){
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

exports.accountModel = function(config){
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

exports.requestModel = function(config){
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
        type : Sequelize.FLOAT
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

exports.forgotModel = function(config){
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

exports.payoutRequestModel = function(config){
	const payout_request = config.define('payout_request', {
	    user_id: {
        type: Sequelize.INTEGER
      },
      amount : {
        type : Sequelize.FLOAT
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

exports.trackModel = function(config){
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

exports.navStoreModel = function(config){
	const nav = config.define('nav_store', {
    nav: {
      type: Sequelize.FLOAT
    },
    nav_per_unit: {
      type: Sequelize.FLOAT
    },
    gain_loss: {
      type: Sequelize.FLOAT
    },
    per_change : {
      type : Sequelize.FLOAT(11)
    },
    date : {
      type : Sequelize.DATE
    },
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return nav;
}

exports.fundAllocationStoreModel = function(config){
	const fund_allocation = config.define('fund_allocation_store', {
    date : {
      type : Sequelize.DATE
    },
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return fund_allocation;
}

exports.fundAllocationCollectionModel = function(config){
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
    date : {
      type : Sequelize.DATE
    },
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return fund_allocation_collection;
}

exports.approveModel = function(config){
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

exports.portfolioModel = function(config){
	const portfolio = config.define('portfolio', {
    name: {
      type: Sequelize.STRING
	  },
    user_id: {
      type: Sequelize.INTEGER
    },
    payment_number: {
      type: Sequelize.STRING
    },
    risk_factor: {
      type: Sequelize.INTEGER
	  },
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return portfolio;
}

exports.riskModel = function(config){
	const risk = config.define('risk', {
    risk: {
      type: Sequelize.INTEGER,
      unique : true
	  },
    distribution: {
      type: Sequelize.STRING
	  },
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return risk;
}

exports.fundModel = function(config){
	const fund = config.define('fund', {
    name: {
      type: Sequelize.STRING
	  },
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'A'
	  }
	}, {underscored: true});

	return fund;
}

exports.bankTransactionAMSLog = function(config){
	const bt_log = config.define('bank_transaction_ams_log', {
    status: {
      type: Sequelize.STRING(1),
      defaultValue : 'F'
	  }
	}, {underscored: true});

	return bt_log;
}

exports.usersModel = function(config){
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
      company_id :{
        type : Sequelize.INTEGER
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
        type : Sequelize.DOUBLE
      },
      actual_balance : {
        type : Sequelize.DOUBLE
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