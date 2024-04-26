import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products-create',
  templateUrl: './products-create.component.html',
  styleUrl: './products-create.component.scss'
})
export class ProductsCreateComponent {
	constructor(private _ps: ProductService) { }
	chatGPT = `[{name: 'Entity Name'}]`;
	close: () => void;
	entities = '';
	tag: string;
	create() {
		const entities = JSON.parse(this.entities);
		for (const entity of entities) {
			entity.tags = this.tag ? [this.tag] : [];
			this._ps.create(entity);
		}
	}
}
