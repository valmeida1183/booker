import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
   /*public name: string;
    public description: string;
    public imagePath: string;
    public ingredients: Ingredients[];

    constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
    } */

    // All de code above can be simplified by this sintax:
    constructor(public name: string,
                public description: string,
                public imagePath: string,
                public ingredients: Ingredient[]) {}
}
