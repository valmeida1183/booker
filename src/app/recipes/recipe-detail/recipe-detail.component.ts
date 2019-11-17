import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../state-management/reducers/app.reducer';
import * as RecipesActions from '../../state-management/actions/recipe.action';
import * as ShoppingListActions from '../../state-management/actions/shopping-list.action';

@Component({
  selector: 'bkr-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
              private activedRoute: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // this.getRecipeFromRouteParams();
    this.getRecipeFromStoreUsingRouteParams();
  }

  onSendIngredientsToShoppingList() {
    // Poderia chamar diretamente o shopping list service para fazer isso.
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);

    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['recipes']);
  }

  // usado na abordagem por services
  private getRecipeFromRouteParams() {
    this.activedRoute.params
      .subscribe((params: Params) => {
        this.id = +params.id;
        this.recipe = this.recipeService.getRecipe(this.id);
      });
  }

  // usado na abordagem por NgRX
  private getRecipeFromStoreUsingRouteParams() {
    // aqui não é preciso guardar o subscription para fazer o unsubscribe pq o angular cuida disso no ngRoute
    this.activedRoute.params
      .pipe(
        map(params => {
          return +params.id;
        }),
        // switchMap é usado para alterar o observable, no caso de routerParams observalbe para store observalbe
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipeState => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      ).subscribe(recipe => {
        this.recipe = recipe;
      });
  }
}
