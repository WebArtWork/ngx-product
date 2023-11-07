import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core';
import { ProductsComponent } from './products.component';
import { Routes, RouterModule } from '@angular/router';
import { ProductsTemplateComponent } from './products/products-template/products-template.component';

const routes: Routes = [{
	path: '',
	component: ProductsComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		ProductsComponent,
  ProductsTemplateComponent
	],
	providers: []

})

export class ProductsModule { }
