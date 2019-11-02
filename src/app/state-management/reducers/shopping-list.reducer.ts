import { Ingredient } from 'src/app/shared/ingredient.model';
// Sintaxe de agrupar tudo de um arquivo em um objeto.
import * as ShoppingListActions from '../actions/shopping-list.action';
import { Action } from '@ngrx/store';

export interface State {
    ingredients: Ingredient [];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

// Estado inicial do Reducer, geralmente é um objeto
const initialState: State = {
    ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer(
    state: State = initialState,
    action: Action
) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            /* No Redux, state é immutável, portanto não se edita o objeto "state", mas sim uma cópia dele.
               No caso a cópia de state e depois uma cópia do array de ingredientes, tudo utilizando o operador spread ES6.
            */
            return {
                ...state,
                ingredients: [...state.ingredients, (action as ShoppingListActions.AddIngredient).payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...(action as ShoppingListActions.AddIngredients).payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            /* Essa lógica é necessária pois sempre preciso devolver uma cópia do state, lembrando que os objetos são imutáveis
               no exemplo updatedIngredient tem todas as props do ingredient salvo no state e tem suas props
               sobrescritas pelo objeto ingredient que vem da action.payload. A mesma idéia se aplica para o array updatedIngredients
               onde é substiuído um objeto ingredient na cópia do array original do state.
            */
            const updateAction = (action as ShoppingListActions.UpdateIngredient);
            // referência original de ingredient na store.
            const ingredient = state.ingredients[state.editedIngredientIndex];
            // cópia do original de igredient que será alterado.
            const updatedIngredient = {
                ...ingredient,
                ...updateAction.payload
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ing, ingIndex) => {
                    return ingIndex !== state.editedIngredientIndex;
                }),
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        case ShoppingListActions.START_EDIT:
            const startEditAction = (action as ShoppingListActions.StartEdit);
            return {
                ...state,
                editedIngredientIndex: startEditAction.payload,
                editedIngredient: { ...state.ingredients[startEditAction.payload]}
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        default:
            return state;
    }
}
