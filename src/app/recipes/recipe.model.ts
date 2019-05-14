export class Recipe {
   /*  public name: string;
    public description: string;
    public imagePath: string;

    constructor(name: string, desc: string, imagePath: string) {
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
    } */

    // All de code above can be simplified by this sintax:
    constructor(public name: string,
                public description: string,
                public imagePath: string) {}
}
