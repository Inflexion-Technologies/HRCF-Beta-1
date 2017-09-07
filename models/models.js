import Sequelize from 'sequelize';
import _ from 'lodash';

var utils = require('../services/utils');

export function companyModel(config){
	const company = config.define('companys', {
      name: {
        type: Sequelize.STRING
      },
      location: {
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
	const transactions = config.define('transactions', {
      type: {
        type: Sequelize.DOUBLE,
        values : ['W','C']
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return transactions;
}

export function withdrawalModel(config){
	const withdrawals = config.define('withdrawals', {
      amount: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return withdrawals;
}

export function creditModel(config){
	const credits = config.define('credits', {
      amount: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.STRING(1),
        defaultValue: 'A'
      }
	  }, {underscored: true});

	  return credits;
}

export function bankModel(config){
	const banks = config.define('banks', {
	    name: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('name', _.capitalize(val).trim());
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

export function branchModel(config){
	const bankBranch = config.define('bank_branches', {
	    name: {
        type: Sequelize.STRING
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

export function trackModel(config){
	const track = config.define('trackers', {
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

export function approveModel(config){
	const approvers = config.define('approvers', {
      firstname: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('firstname', _.capitalize(val).trim());
        }
      },
      lastname: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('lastname', _.capitalize(val).trim());
        }
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
	    status: {
        type: Sequelize.STRING(1),
        defaultValue : 'A'
	  }
	}, {underscored: true});

	return approvers;
}

export function usersModel(config){
	const users = config.define('users', {
      firstname: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('firstname', _.capitalize(val).trim());
        }
      },
      lastname: {
        type: Sequelize.STRING,
        set(val) {
          this.setDataValue('lastname', _.capitalize(val).trim());
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
      type: {
        type: Sequelize.ENUM,
        values : ['C','I']
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