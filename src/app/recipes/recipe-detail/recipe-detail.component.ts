import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'bkr-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
              private activedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getRecipeFromRouteParams();
  }

  onSendIngredientsToShoppingList() {
    // Poderia chamar diretamente o shopping list service para fazer isso.
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  private getRecipeFromRouteParams() {
    this.activedRoute.params
      .subscribe((params: Params) => {
        this.id = +params.id;
        this.recipe = this.recipeService.getRecipe(this.id);
      });
  }
}
