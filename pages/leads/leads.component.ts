import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import {
	LeadService,
	Lead
} from '../../services/lead.service';
import { AlertService, CoreService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';

@Component({
	templateUrl: './leads.component.html',
	styleUrls: ['./leads.component.scss']
})
export class LeadsComponent {
	columns = ['name', 'description'];

	form: FormInterface = this._form.getForm('leads', {
		formId: 'leads',
		title: 'Leads',
		components: [
			{
				name: 'Text',
				key: 'name',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill leads title'
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
						value: 'fill leads description'
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
			this._form.modal<Lead>(this.form, {
				label: 'Create',
				click: (created: unknown, close: () => void) => {
					this._ls.create(created as Lead);
					close();
				}
			});
		},
		update: (doc: Lead) => {
			this._form.modal<Lead>(this.form, [], doc).then((updated: Lead) => {
				this._core.copy(updated, doc);
				this._ls.save(doc);
			});
		},
		delete: (doc: Lead) => {
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
							this._ls.delete(doc);
						}
					}
				]
			});
		}
	};

	get rows(): Lead[] {
		return this._ls.leads;
	}

	constructor(
		private _translate: TranslateService,
		private _alert: AlertService,
		private _ls: LeadService,
		private _form: FormService,
		private _core: CoreService
	) {}
}
