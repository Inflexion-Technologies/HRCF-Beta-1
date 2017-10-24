import _ from 'lodash';

   export function isAlphabets(text){

        if(!(text.trim().length)){
            return false;
        }

        const tmpText = _.toArray(text.trim());
        const result = _.map(tmpText, (it)=>{
                            if(_.toUpper(it) === _.toLower(it) && it !== ' '){
                                return false;
                            }
                        })

        return !(_.includes(result, false));
    }

   export function isNumbers(text){
        if(!(text.trim().length)){
            return false;
        }

        const tmpText = _.toArray(text.trim());
        const result = _.map(tmpText, (it)=>{
                            if(!(_.toUpper(it) === _.toLower(it) && it !== ' ')){
                                return false;
                            }
                        })

        return !(_.includes(result, false));
    }
    

    export function isMSISDN(text){


        if(text.trim().length !== 10){
            return false;
        }

        const WHITELIST = ['02','05'];

        if(text.startsWith(WHITELIST[0]) || text.startsWith(WHITELIST[1])){
            const tmpText = _.toArray(text.trim());
            const result = _.map(tmpText, (it)=>{
                                if(!(_.toUpper(it) === _.toLower(it) && it !== ' ')){
                                    return false;
                                }
                            })
    
            return !(_.includes(result, false));
        }else{
            return false;
        }
    }

    export function isEmail(email){
        const re = /\S+@\S+\.\S+/;
        return re.test(email.trim());
    }

    export function redirect(link){
        this.props.history.push(link);
    }

    export function isAccountNumber(text){
        if(!(text.trim().length >= 13 && text.trim().length <= 16)){
            return false;
        }

        const tmpText = _.toArray(text.trim());
        const result = _.map(tmpText, (it)=>{
                            if(!(_.toUpper(it) === _.toLower(it) && it !== ' ')){
                                return false;
                            }
                        })

        return !(_.includes(result, false));
    }


