import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Product {
	_id: string;
	name: string;
	description: string;
}

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	products: Product[] = [];

	_products: any = {};

	new(): Product {
		return {
			_id: '',
			name: '',
			description: ''
		}
	}

	constructor(
		private mongo: MongoService,
		private alert: AlertService
	) {
		this.products = mongo.get('product', {}, (arr: any, obj: any) => {
			this._products = obj;
		});
	}

	create(
		product: Product = this.new(),
		callback = (created: Product) => {},
		text = 'product has been created.'
	) {
		if (product._id) {
			this.save(product);
		} else {
			this.mongo.create('product', product, (created: Product) => {
				callback(created);
				this.alert.show({ text });
			});
		}
	}

	doc(productId: string): Product {
		if(!this._products[productId]){
			this._products[productId] = this.mongo.fetch('product', {
				query: {
					_id: productId
				}
			});
		}
		return this._products[productId];
	}

	update(
		product: Product,
		callback = (created: Product) => {},
		text = 'product has been updated.'
	): void {
		this.mongo.afterWhile(product, ()=> {
			this.save(product, callback, text);
		});
	}

	save(
		product: Product,
		callback = (created: Product) => {},
		text = 'product has been updated.'
	): void {
		this.mongo.update('product', product, () => {
			if(text) this.alert.show({ text, unique: product });
		});
	}

	delete(
		product: Product,
		callback = (created: Product) => {},
		text = 'product has been deleted.'
	): void {
		this.mongo.delete('product', product, () => {
			if(text) this.alert.show({ text });
		});
	}
}
