import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  //#region pProperties
  private recipes: Recipe[] = [
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
  ];

  recipeSelected = new EventEmitter<Recipe>();
  //#endregion

  constructor(private shoppingListService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice(); // slice sem argumentos retorna uma cópia do array.
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.setIngredients(ingredients);
  }
}
