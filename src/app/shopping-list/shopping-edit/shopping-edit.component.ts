import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
// Sintaxe de agrupar tudo de um arquivo em um objeto.
import * as ShoppingListActions from '../../state-management/actions/shopping-list.action';
import * as fromShoppingList from '../../state-management/reducers/shopping-list.reducer';

@Component({
  selector: 'bkr-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingEditForm') shoppingEditForm: NgForm;

  private subscription: Subscription;
  editedItem: Ingredient;
  editMode = false;

  constructor(
    // private shoppingListService: ShoppingListService, -> Este serviço foi substituido pela abordagem do Ngrx
    private store: Store<fromShoppingList.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.shoppingEditForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
    /* this.subscription = this.shoppingListService.startedEditing
      .subscribe((index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.shoppingEditForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }); */
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      // this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
      const updatedIngredient = new ShoppingListActions.UpdateIngredient(newIngredient);
      this.store.dispatch(updatedIngredient);
    } else {
      // this.shoppingListService.addIgredient(ingredient);
      const addIgredientction = new ShoppingListActions.AddIngredient(newIngredient);
      this.store.dispatch(addIgredientction);
    }

    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.editMode = false;
    this.shoppingEditForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.shoppingListService.deleteIngredient(this.editedItemIndex);
    const deletedIngredient = new ShoppingListActions.DeleteIngredient();
    this.store.dispatch(deletedIngredient);
    this.onClear();
  }
}
