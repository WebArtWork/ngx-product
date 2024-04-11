import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Product {
	_id?: string;
	name: string;
	tag: string;
	tags: string[];
	description: string;
	isTemplate: boolean;
	template: string;
}

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	products: Product[] = [];
	byTag: Record<string, Product[]> = {};

	_products: any = {};

	new(): Product {
		return {} as Product;
	}

	constructor(private mongo: MongoService, private alert: AlertService) {
		this.products = mongo.get(
			'product',
			{
				groups: 'tag',
				query: {
					isTemplate: (doc: Product) => doc.isTemplate,
					isNotTemplate: (doc: Product) => !doc.isTemplate
				}
			},
			(arr: any, obj: any) => {
				this._products = obj;
				this.byTag = obj.tag;
			}
		);
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
				if (typeof callback === 'function') {
					callback(created);
				}
				if (text) {
					this.alert.show({ text });
				}
			});
		}
	}

	doc(productId: string): Product {
		if (!this._products[productId]) {
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
		callback = () => {},
		text = 'product has been updated.'
	): void {
		this.mongo.afterWhile(product, () => {
			this.save(product, callback, text);
		});
	}

	save(
		product: Product,
		callback = () => {},
		text = 'product has been updated.'
	): void {
		this.mongo.update('product', product, () => {
			if (typeof callback === 'function') {
				callback();
			}
			if (text) this.alert.show({ text, unique: product });
		});
	}

	delete(
		product: Product,
		callback = () => {},
		text = 'product has been deleted.'
	): void {
		this.mongo.delete('product', product, () => {
			if (typeof callback === 'function') {
				callback();
			}
			if (text) this.alert.show({ text });
		});
	}
}
