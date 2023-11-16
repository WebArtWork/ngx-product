import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import {
	ProductService,
	Product
} from 'src/app/modules/product/services/product.service';
import { AlertService, CoreService, HttpService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { TagService } from 'src/app/modules/tag/services/tag.service';
import { ModalService } from 'src/app/modules/modal/modal.service';

import { Router } from '@angular/router';
import { ProductsTemplateComponent } from './products/products-template/products-template.component';

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
		create:
			this._router.url === '/craftsman/craftlinks'
				? null
				: () => {
						this._form.modal<Product>(this.form, {
							label: 'Create',
							click: (created: unknown, close: () => void) => {
								(created as Product).isTemplate =
									this._router.url === '/craftsman/crafts'
										? true
										: false;
								this._ps.create(created as Product);
								close();
							}
						});
				  },
		update:
			this._router.url === '/craftsman/craftlinks'
				? null
				: (doc: Product) => {
						this._form
							.modal<Product>(this.form, [], doc)
							.then((updated: Product) => {
								this._core.copy(updated, doc);
								this._ps.save(doc);
							});
				  },
		delete:
			this._router.url === '/craftsman/craftlinks'
				? null
				: (doc: Product) => {
						this._alert.question({
							text: this._translate.translate(
								'Common.Are you sure you want to delete this product?'
							),
							buttons: [
								{
									text: this._translate.translate('Common.No')
								},
								{
									text: this._translate.translate(
										'Common.Yes'
									),
									callback: () => {
										this._ps.delete(doc);
									}
								}
							]
						});
				  },
		buttons:
			this._router.url === '/craftsman/craftlinks'
				? null
				: [
						{
							icon: 'cloud_download',
							click: (doc: Product) => {
								this._form.modalUnique<Product>(
									'product',
									'url',
									doc
								);
							}
						}
				  ],
		headerButtons:
		this._router.url === '/manage/products'
		? null
		: [
			{
				text: 'Add from crafts',
				click: () => {
					this._modal.show({
						component: ProductsTemplateComponent,
						class: 'forms_modal'
					});
				}
			}
		]
	};

	products: Product[] = [];

	get rows(): Product[] {
		return this._router.url === '/craftsman/crafts'
			? this._ps._products.isTemplate
			: this._router.url === '/craftsman/craftlinks' ||
			  this._router.url === '/admin/products'
			? this.products
			: this._ps._products.isNotTemplate;
	}
	get title(): string {
		if (this._router.url === '/craftsman/crafts') {
			return 'Crafts'
		}

		if (this._router.url === '/craftsman/craftlinks') {
			return 'Product Links'
		}

		return 'Products';
	}

	constructor(
		private _translate: TranslateService,
		private _alert: AlertService,
		private _ps: ProductService,
		private _form: FormService,
		private _core: CoreService,
		private _modal: ModalService,
		private _http: HttpService,
		private _ts: TagService,
		private _router: Router,
	) {
		if (this._router.url === '/craftsman/craftlinks') {
			this._http.get('/api/product/getlinks', (links: Product[]) => {
				links.forEach((product: Product)=>this.products.push(product));
			});
		} else if (this._router.url === '/admin/products') {
			this._http.get('/api/product/getadmin', (links: Product[]) => {
				links.forEach((product: Product)=>this.products.push(product));
			});
		}
	}
}
