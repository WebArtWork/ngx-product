import { Component } from '@angular/core';
import { HttpService } from 'wacom';
import {
	ProductService,
	Product
} from 'src/app/modules/product/services/product.service';

@Component({
	selector: 'app-products-template',
	templateUrl: './products-template.component.html',
	styleUrls: ['./products-template.component.scss']
})
export class ProductsTemplateComponent {
	crafts: any = [];

	constructor(private _http: HttpService, private _ps: ProductService) {
		_http.get('/api/product/getcrafts', (resp) => {
			this.crafts = resp;
		});
	}
	create(craft: Product) {
		craft = JSON.parse(JSON.stringify(craft));
		craft.template = craft._id as string;
		delete craft._id;
		craft.isTemplate = false;
		this._ps.create(craft);
	}
}
