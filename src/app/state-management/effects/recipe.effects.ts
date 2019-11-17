import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as RecipesActions from '../../state-management/actions/recipe.action';
import * as fromApp from '../../state-management/reducers/app.reducer';
import { Recipe } from 'src/app/recipes/recipe.model';

@Injectable()
export class RecipeEffects {
    @Effect()
    fetchRecipes = this.actions$
        .pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>('https://recipe-booker.firebaseio.com/recipes.json');
            }),
            map(recipes => {
                return recipes.map(recipe => {
                  return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                });
            }),
            map(recipes => {
                return new RecipesActions.SetRecipes(recipes);
            })
        );

    @Effect({dispatch: false})
    storeRecipes = this.actions$
        .pipe(
           ofType(RecipesActions.STORE_RECIPES),
           // withLatestFrom permite fazer o merge de um valor de um observalbe para outro
           withLatestFrom(this.store.select('recipes')),
           switchMap(([actionData, recipesState]) => {
                return this.http.put('https://recipe-booker.firebaseio.com/recipes.json', recipesState.recipes);
           })
        );

    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>) { }
}
