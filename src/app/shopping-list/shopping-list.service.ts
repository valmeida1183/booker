import { Ingredient } from '../shared/ingredient.model';
import { EventEmitter } from '@angular/core';

export class ShoppingListService {
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

/*    O eventEmmiter aqui é usado como exemplo, pois retornando o array original,
   ao invés de uma cópia com slice ele tbm seria atualizado no shoppin-list-component. */
   ingredientsChanged = new EventEmitter<Ingredient[]>();

  constructor() { }

  getIngredients(): Ingredient[] {
    // slice sem argumentos retorna uma cópia do array.
    return this.ingredients.slice();
  }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(... ingredients);
    this.ingredientsChanged.emit(this.ingredients.slice()); // trabalhando com cópia por motivos de segurança apenas.
  }

  addIgredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.emit(this.ingredients.slice()); // trabalhando com cópia por motivos de segurança apenas.
  }
}
