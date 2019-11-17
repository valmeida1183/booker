import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.action';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

export function reciperReducer(state = initialState, action: RecipeActions.RecipesActions) {
    switch (action.type) {
        case RecipeActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipeActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case RecipeActions.UPDATE_RECIPE:
            // usando spread para fazer o merge do recipe do state com o novo
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe
            };

            // usando spread para compiar um array e setar o novo recipe para esta cópia
            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe;

            return {
                ...state,
                recipes: updatedRecipes
            };
        case RecipeActions.DELETE_RECIPE:
            return {
                ...state,
                // usando filter (que retorna uma nova lista) para deletar
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== action.payload;
                })
            };
        default:
            return state;
    }
}
