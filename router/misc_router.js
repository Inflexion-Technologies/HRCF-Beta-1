import express from 'express';

export default class MiscRoutes{

    constructor(Users, Accounts, Approvers, Companys){
        this.Users = Users;
        this.Accounts = Accounts;
        this.Approvers = Approvers;
        this.Companys = Companys;
    }

    routes(){
        const app = this;
        const miscRouter = express.Router();

        miscRouter.route('/user/:id/complete_registration')
            .put((req, res)=>{  
                app.Users.findOne({ where: {id : req.params.id, status: 'A'}}).then(user => {
                    return user;
                }).then((user)=>{
                    if((req.body.secondary_branch_id !== null && req.body.secondary_branch_id !== undefined) && (req.body.secondary_approver_msisdn !== null && req.body.secondary_approver_msisdn !== undefined)){
                        //Save bulk   
                        console.log('Doing Multiple Save On All');
                        app.doSecondaryUpdate(req, res, user);
                    }else if(req.body.secondary_branch_id !== null && req.body.secondary_branch_id !== undefined){
                        console.log('Doing Multiple Bank Save');                        
                        app.doBankSecondaryUpdate(req, res, user);
                    }else if(req.body.secondary_approver_msisdn !== null && req.body.secondary_approver_msisdn !== undefined){
                        console.log('Doing Multiple Approver Save');                                                
                        app.doApproverSecondaryUpdate(req, res, user);
                    }else{
                        app.doPrimaryUpdate(req, res, user);
                    }
                })
            });   

        miscRouter.route('/user/:id/company')
            .get((req, res)=>{
                app.Users.findOne({ where: {id : req.params.id, status: 'A'}}).then(user => {
                    return user;
                }).then((user)=>{
                    return app.Companys.findOne({where :{id : user.company_id}}).then((company)=>{
                        return company;
                    })
                }).then((company)=>{
                    res.status(200).json(company);
                })
            });  

        miscRouter.route('/')
        .post((req, res)=>{
            if(req.body){
                app.Banks.create(req.body).then((bank)=>{
                    res.status(200).json(bank);                                
                })
            }else{
                res.status(200).send('Data not saved!');
            }
        }); 

        miscRouter.route('/:id')
            .delete((req, res)=>{
                app.Banks.update({status : 'D'}, {where : {id : req.params.id}}).then((bank)=>{
                    res.status(200).json(bank);
                });
            });

        return miscRouter;
    }

    doPrimaryUpdate(req, res, user){
        const app = this;

        app.Accounts.create({name : req.body.primary_account_name, user_id : user.id, account_number: req.body.primary_account_number, bank_branch_id: req.body.primary_branch_id
        }).then((account)=>{
            user.addAccount(account);                          
            return user;
        }).then((user)=>{
            return app.Approvers.create({user_id: user.id, firstname : req.body.primary_approver_first, lastname : req.body.primary_approver_last, email : req.body.primary_approver_email, msisdn : req.body.primary_approver_msisdn, company_id : user.company_id}).
            then((approver)=>{
                return approver
            })
        }).then((approver)=>{
            user.addApprover(approver);
            user.update({is_complete: true, id_type_id: req.body.id_type_id, id_number : req.body.id_number});
            return user;
        }).then((user)=>{
            if(!(parseInt(req.body.reg_number) === 0)){
                return app.Companys.findOne({where :{id: user.company_id, status : 'A'}}).then((company)=>{
                    company.update({reg_number : req.body.reg_number});
                    return user;
                })
            }else{
                return user;
            }
        }).then((user)=>{
            res.status(200).json(user);            
        })
    }

    doBankSecondaryUpdate(req, res, user){
        const app = this;

        app.Accounts.create({name : req.body.secondary_account_name, user_id : user.id, account_number: req.body.secondary_account_number, bank_branch_id: req.body.secondary_branch_id
        }).then((account)=>{
            user.addAccount(account);                          
            return user;
        }).then((user)=>{
            user.update({is_complete: true});
            return user;
        }).then((user)=>{
            app.doPrimaryUpdate(req, res, user);
        })
    }

    doApproverSecondaryUpdate(req, res, user){
        const app = this;

        app.Approvers.create({user_id: user.id, firstname : req.body.secondary_approver_first, lastname : req.body.secondary_approver_last, email : req.body.secondary_approver_email, msisdn : req.body.secondary_approver_msisdn, company_id : user.company_id
        }).then((approver)=>{
            return approver
        }).then((approver)=>{
            user.addApprover(approver);
            user.update({is_complete: true});
            return user;
        }).then((user)=>{
            app.doPrimaryUpdate(req, res, user);
        })
    }

    doSecondaryUpdate(req, res, user){
        const app = this;

        app.Accounts.create({name : req.body.secondary_account_name, user_id : user.id, account_number: req.body.secondary_account_number, bank_branch_id: req.body.secondary_branch_id
        }).then((account)=>{
            user.addAccount(account);                          
            return user;
        }).then((user)=>{
            return app.Approvers.create({user_id: user.id, firstname : req.body.secondary_approver_first, lastname : req.body.secondary_approver_last, email : req.body.secondary_approver_email, msisdn : req.body.secondary_approver_msisdn, company_id : user.company_id}).
            then((approver)=>{
                return approver
            })
        }).then((approver)=>{
            user.addApprover(approver);
            user.update({is_complete: true});
            return user;
        }).then((user)=>{
            app.doPrimaryUpdate(req, res, user);
        })
    }

};