import { EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';

export class RecipeService {
  //#region pProperties
  private recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is a simply test',
    'https://cdn-image.myrecipes.com/sites/default/files/styles/medium_2x/public/image/recipes/ck/11/04/fettuccine-olive-oil-ck-x.jpg')
  ];

  recipeSelected = new EventEmitter<Recipe>();
  //#endregion

  constructor() { }

  getRecipes() {
    return this.recipes.slice(); // slice sem argumentos retorna uma cópia do array.
  }
}
