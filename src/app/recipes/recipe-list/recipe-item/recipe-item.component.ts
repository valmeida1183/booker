import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'bkr-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
  }

  onSelected() {
    /*     Note que o evento está sendo emitido aqui, pois é aqui é o componente
    em que selecionamos o recipe e são estes dados selecionados que queremos transmitir. */
    this.recipeService.recipeSelected.emit(this.recipe);
  }
}
