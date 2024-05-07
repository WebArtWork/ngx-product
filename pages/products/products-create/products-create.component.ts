import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products-create',
  templateUrl: './products-create.component.html',
  styleUrl: './products-create.component.scss'
})
export class ProductsCreateComponent {
	constructor(private _ps: ProductService) { }
	chatGPT = `Here is a schema for a MongoDB collection:
	mongoose.Schema({
		name: String,
		url: String,
		description: String,
		price: Number,
		weight: String
	})
	Please review this schema. I will provide you with specific details about the documents I need you to generate in a follow-up message. For now, do not create or suggest any documents; just acknowledge the schema and wait for my next instructions. I need you to generate data in format of JSON, array with objects. All fields keep as they are url out of name field and use english letters only without space and special characters.`;
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
