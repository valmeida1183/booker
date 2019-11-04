import { Action } from '@ngrx/store';

/* Identificadores devem ser únicos em toda a aplicação.
   Ou seja nenhuma outra action deve conter os mesmos identificadores, pois todos os reducers são acionados ao se fazer um "dispatch".
   Na documentação do NgRx se aconselha colocar prefixos com o nome do arquivo da action, conforme o exemplo abaixo:
*/
export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const AUTHENTICATE_FAIL = '[Auth] Login Failed';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: { email: string, password: string }) {}
}

export class AuthenticateSuccess implements Action {
   readonly type: string = AUTHENTICATE_SUCCESS;

   constructor(public payload: {email: string, userId: string, token: string, expirationDate: Date}) {}
}

export class AuthenticateFail implements Action {
    readonly type: string = AUTHENTICATE_FAIL;

    constructor(public payload: string) {}
}

export class SignupStart implements Action {
    readonly type: string = SIGNUP_START;

    constructor(public payload: { email: string, password: string }) {}
}

export class ClearError implements Action {
    readonly type: string = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type: string = AUTO_LOGIN;
}

export class Logout implements Action {
    readonly type: string = LOGOUT;
}

export type AuthActions =
| AuthenticateSuccess
| Logout
| LoginStart
| AuthenticateFail
| SignupStart
| ClearError
| AutoLogin;
