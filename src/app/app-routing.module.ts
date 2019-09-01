import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeResolverService } from './recipes/recipe-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard.guard';

const routes: Routes = [
  // todas as rotas atendem por '', portanto só redirecionará para recipes se a rota absoluta for '' com o uso do pathMatch: 'full'
  { path: '', redirectTo: '/recipes', pathMatch: 'full'},
  { path: 'recipes',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
    { path: '', component: RecipeStartComponent },
    { path: 'new', component: RecipeEditComponent}, // a rota "new" deve vir antes da ":id", lembrando rotas mais genéricas devem vir depois
    {
      path: ':id',
      component: RecipeDetailComponent,
      resolve: [RecipeResolverService]
    },
    {
      path: ':id/edit',
      component: RecipeEditComponent,
      resolve: [RecipeResolverService]
    }
  ]
  },
  { path: 'shopping-list', component: ShoppingListComponent},
  { path: 'auth', component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
