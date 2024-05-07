import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import {
	ProductService,
	Product
} from 'src/app/modules/product/services/product.service';
import {
	AlertService,
	CoreService,
	HttpService,
	MongoService,
	StoreService as _StoreService
} from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { Tag, TagService } from 'src/app/modules/tag/services/tag.service';
import { ModalService } from 'src/app/modules/modal/modal.service';

import { Router } from '@angular/router';
import { ProductsTemplateComponent } from './products-template/products-template.component';
import { ProductsCreateComponent } from './products-create/products-create.component';
import { UserService } from 'src/app/core';
import {
	Store,
	StoreService
} from 'src/app/modules/store/services/store.service';

@Component({
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
	columns = ['enabled', 'top', 'thumb', 'name', 'price'];

	tags: Tag[] = [];
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
				name: 'Text',
				key: 'weight',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill product weight'
					},
					{
						name: 'Label',
						value: 'Weight'
					}
				]
			},
			{
				name: 'Select',
				key: 'tags',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill product tag'
					},
					{
						name: 'Label',
						value: 'Tag'
					},
					{
						name: 'Multiple',
						value: true
					},
					{
						name: 'Items',
						// value: this._ts.tags
						value: this.tags
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
								this._ps.create(
									created as Product,
									this.setProducts.bind(this)
								);
								close();
							}
						}, this.tag ? { tags: [this.tag] } : {});
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
										this._ps.delete(
											doc,
											this.setProducts.bind(this)
										);
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
		headerButtons: [
			this._us.role('admin') || this._us.role('agent')
				? {
						icon: 'add_circle',
						click: () => {
							this._modal.show({
								component: ProductsCreateComponent,
								tag: this.tag
							});
						}
				  }
				: null
			// {
			// 	text: 'Add from crafts',
			// 	click: () => {
			// 		this._modal.show({
			// 			component: ProductsTemplateComponent,
			// 			class: 'forms_modal'
			// 		});
			// 	}
			// }
		]
	};

	products: Product[] = [];
	setProducts() {
		this.products.splice(0, this.products.length);
		for (const product of this._ps.products) {
			product.tags = product.tags || [];
			if (this.tag) {
				if (product.tags.includes(this.tag)) {
					this.products.push(product);
				}
			} else {
				this.products.push(product);
			}
		}
	}
	get title(): string {
		if (this._router.url === '/craftsman/crafts') {
			return 'Crafts';
		}

		if (this._router.url === '/craftsman/craftlinks') {
			return 'Product Links';
		}

		return 'Products';
	}

	update(product: Product) {
		this._ps.update(product);
	}

	tagIncludeStore(tag: Tag) {
		if (tag.stores.includes(this.store)) return true;
		while (tag.parent) {
			tag = this._ts.doc(tag.parent);
			if (tag.stores.includes(this.store)) return true;
		}
		return false;
	}
	setTags() {
		this.tags.splice(0, this.tags.length);
		for (const tag of this._ts.tags) {
			tag.stores = tag.stores || [];
			if (!this.store || this.tagIncludeStore(tag)) {
				this.tags.push({
					...tag,
					name: this.tagName(tag)
				});
			}
		}
		this.tags.sort((a, b) => {
			if (a.name < b.name) {
				return -1; // a comes first
			} else if (a.name > b.name) {
				return 1; // b comes first
			} else {
				return 0; // no sorting necessary
			}
		});
		this.setProducts();
	}
	tag: string;
	available: string;
	setTag(tagId: string) {
		this._store.set('tag', tagId);
		this.tag = tagId;
		this.available = '';
		if (tagId) {
			let tag = this._ts.doc(tagId);
			while (tag.parent) {
				tag = this._ts.doc(tag.parent);
				this.available += (this.available ? ', ' : '') + tag.name;
			}
		}
		this.setProducts();
	}
	tagName(tag: Tag) {
		let name = tag.name;
		while (tag.parent) {
			tag = this._ts.doc(tag.parent);
			name = tag.name + ' / ' + name;
		}
		return name;
	}

	get stores(): Store[] {
		return this._ss.stores;
	}
	store: string;
	setStore(store: string) {
		this.store = store;
		this._store.set('store', store);
		this.setTags();
	}

	constructor(
		private _translate: TranslateService,
		private _modal: ModalService,
		private _alert: AlertService,
		private _mongo: MongoService,
		private _store: _StoreService,
		private _ps: ProductService,
		private _form: FormService,
		private _core: CoreService,
		private _http: HttpService,
		private _ss: StoreService,
		private _us: UserService,
		private _ts: TagService,
		private _router: Router
	) {
		this._store.get('store', this.setStore.bind(this));
		this._store.get('tag', this.setTag.bind(this));
		this._mongo.on('tag', this.setTags.bind(this));
		this._mongo.on('product', this.setProducts.bind(this));
		if (this._router.url === '/craftsman/craftlinks') {
			this._http.get('/api/product/getlinks', (links: Product[]) => {
				links.forEach((product: Product) =>
					this.products.push(product)
				);
			});
		} else if (this._router.url === '/admin/products') {
			this._http.get('/api/product/getadmin', (links: Product[]) => {
				links.forEach((product: Product) =>
					this.products.push(product)
				);
			});
		}
	}
}
