import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
// Sintaxe de agrupar tudo de um arquivo em um objeto.
import * as ShoppingListActions from '../state-management/actions/shopping-list.action';
import * as fromShoppingList from '../state-management/reducers/shopping-list.reducer';

@Injectable()
export class RecipeService {
  //#region Properties
  /* private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A super tasty Schnitzel - just awesome!',
      'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 30)
      ]),
    new Recipe(
      'Big Fat Burger',
      'What else you need to say?',
      'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1),
        new Ingredient('Tomato', 1),
        new Ingredient('Lettuce', 1),
        new Ingredient('Cheese', 2),
        new Ingredient('Bacon', 3),
      ])
  ]; */

  private recipes: Recipe[] = [];

  recipesChanged = new Subject<Recipe[]>();
  //#endregion

  constructor(
    // private shoppingListService: ShoppingListService, -> Este serviço foi substituido pela abordagem do Ngrx
    private store: Store<fromShoppingList.AppState>) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice(); // slice sem argumentos retorna uma cópia do array.
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.shoppingListService.addIngredients(ingredients);
    const addIngredientsAction = new ShoppingListActions.AddIngredients(ingredients);
    this.store.dispatch(addIngredientsAction);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
