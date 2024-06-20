import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { ProductsComponent } from './products.component';
import { Routes, RouterModule } from '@angular/router';
import { ProductsTemplateComponent } from './products-template/products-template.component';
import { ProductsCreateComponent } from './products-create/products-create.component';

const routes: Routes = [
	{
		path: '',
		component: ProductsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [
		ProductsComponent,
		ProductsTemplateComponent,
		ProductsCreateComponent
	],
	providers: []
})
export class ProductsModule {}
