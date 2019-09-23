import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  // todas as rotas atendem por '', portanto só redirecionará para recipes se a rota absoluta for '' com o uso do pathMatch: 'full'
  { path: '', redirectTo: '/recipes', pathMatch: 'full'},
  // Para ativar o lazy load é preciso apontar a rota e o path do arquivo do módulo que será carregado
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)},
  { path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)},
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
];

@NgModule({
  // preloadingStrategy siginifica que irá carregar os módulos o mais cedo possível,
  // mantendo o comportamento de lazy load (bundle separadados)
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
