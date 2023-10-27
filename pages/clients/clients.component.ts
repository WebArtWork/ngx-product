import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import { ClientService, Client } from '../../services/client.service';
import { AlertService, CoreService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';

@Component({
	templateUrl: './clients.component.html',
	styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
	columns = ['name', 'description'];

	form: FormInterface = this._form.getForm('clients', {
		formId: 'clients',
		title: 'Clients',
		components: [
			{
				name: 'Text',
				key: 'name',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill clients title'
					},
					{
						name: 'Label',
						value: 'Title'
					}
				]
			},
			{
				name: 'Text',
				key: 'description',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill clients description'
					},
					{
						name: 'Label',
						value: 'Description'
					}
				]
			}
		]
	});

	config = {
		create: () => {
			this._form.modal<Client>(this.form, {
				label: 'Create',
				click: (created: unknown, close: () => void) => {
					this._cs.create(created as Client);
					close();
				}
			});
		},
		update: (doc: Client) => {
			this._form
				.modal<Client>(this.form, [], doc)
				.then((updated: Client) => {
					this._core.copy(updated, doc);
					this._cs.save(doc);
				});
		},
		delete: (doc: Client) => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this cservice?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: () => {
							this._cs.delete(doc);
						}
					}
				]
			});
		}
	};

	get rows(): Client[] {
		return this._cs.clients;
	}

	constructor(
		private _translate: TranslateService,
		private _alert: AlertService,
		private _cs: ClientService,
		private _form: FormService,
		private _core: CoreService
	) {}
}
