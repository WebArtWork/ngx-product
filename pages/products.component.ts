import { Component } from '@angular/core';
import {FormService} from 'src/app/modules/form/form.service';
import { ProductService, Product } from "src/app/modules/product/services/product.service";
import { AlertService, CoreService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { TagService } from 'src/app/modules/tag/services/tag.service';

@Component({
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
	columns = ['name', 'short'];

	form: FormInterface = this._form.getForm('product', {
		formId: 'product',
		title: 'Product',
		components: [
			{
				name: 'Text',
				key: 'name',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill product title'
					},
					{
						name: 'Label',
						value: 'Title'
					}
				]
			},
			{
				name: 'Photo',
				key: 'thumb',
				fields: [
					{
						name: 'Label',
						value: 'Header picture'
					}
				]
			},
			{
				name: 'Photos',
				key: 'thumbs',
				fields: [
					{
						name: 'Label',
						value: 'Detailed pictures'
					}
				]
			},
			{
				name: 'Text',
				key: 'short',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill product short description'
					},
					{
						name: 'Label',
						value: 'Short Description'
					}
				]
			},
			{
				name: 'Text',
				key: 'description',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill product description'
					},
					{
						name: 'Label',
						value: 'Description'
					}
				]
			},
			{
				name: 'Number',
				key: 'price',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill product price'
					},
					{
						name: 'Label',
						value: 'Price'
					}
				]
			},
			{
				name: 'Select',
				key: 'tag',
				fields: [
					{
						name: 'Placeholder',
						value: 'Select tag'
					},
					{
						name: 'Items',
						value: this._ts.group('product')
					}
				]
			}
		]
	});

	config = {
		create: () => {
			this._form
				.modal<Product>(this.form, {
					label: 'Create',
					click: (created: unknown, close: () => void) => {
						this._ps.create(created as Product);
						close();
					}
				});
		},
		update: (doc: Product) => {
			this._form.modal<Product>(this.form, [], doc).then((updated: Product) => {
				this._core.copy(updated, doc);
				this._ps.save(doc);
			});
		},
		delete: (doc: Product) => {
			this._alert.question({
				text: this._translate.translate('Common.Are you sure you want to delete this product?'),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: () => {
							this._ps.delete(doc);
						}
					}
				]
			});
		}
	};

	get rows(): Product[] {
		return this._ps.products;
	}

	constructor(
		private _translate: TranslateService,
		private _alert: AlertService,
		private _ps: ProductService,
		private _form: FormService,
		private _core: CoreService,
		private _ts: TagService
	) {}
}
