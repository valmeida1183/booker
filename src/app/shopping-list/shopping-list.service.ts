import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  constructor() { }

  getIngredients(): Ingredient[] {
    // slice sem argumentos retorna uma cópia do array.
    return this.ingredients.slice();
  }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(... ingredients);
    this.ingredientsChanged.next(this.ingredients.slice()); // trabalhando com cópia por motivos de segurança apenas.
  }

  addIgredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice()); // trabalhando com cópia por motivos de segurança apenas.
  }
}
