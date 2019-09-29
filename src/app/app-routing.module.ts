import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  // todas as rotas atendem por '', portanto só redirecionará para recipes se a rota absoluta for '' com o uso do pathMatch: 'full'
  { path: '', redirectTo: '/recipes', pathMatch: 'full'},
  // Para ativar o lazy load é preciso apontar a rota e o path do arquivo do módulo que será carregado
  { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule'},
  { path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule'},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  // preloadingStrategy siginifica que irá carregar os módulos o mais cedo possível,
  // mantendo o comportamento de lazy load (bundle separadados)
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
