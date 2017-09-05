import dispatcher from '../dispatcher';

export function msisdnLogin(username, password){
    dispatcher.dispatch({
        type : "LOGIN_WITH_MSISDN",
        username,
        password
    });
}