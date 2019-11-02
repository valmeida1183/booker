import { User } from 'src/app/auth/user.model';
import * as AuthActions from '../actions/auth.actions';

export interface State {
   user: User;
   authError: string;
   loading: boolean;
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
    /* log para mostrar que qualquer método dispatch aciona TODOS os reducers,
    portanto cuidado, sempre tenha um initial state e um case default para retornar o state atual! */
    console.log(state);
    switch (action.type) {
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case AuthActions.AUTHENTICATE_SUCCESS:
            const {email, userId, token, expirationDate} = (action as AuthActions.AuthenticateSuccess).payload;
            const loggedUser = new User(email, userId, token, expirationDate);

            return {
                ...state,
                authError: null,
                user: loggedUser,
                loading: false
            };
        case AuthActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                authError: (action as AuthActions.AuthenticateFail).payload,
                user: null,
                loading: false
            };
        case AuthActions.LOGOUT:
            return {
               ...state,
               user: null
            };
        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            };
        default:
            // Sempre se deve devolver o state atual em no caso default.
            return state;
    }
}
