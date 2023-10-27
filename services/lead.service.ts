import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Lead {
	_id: string;
	name: string;
	description: string;
}

@Injectable({
	providedIn: 'root'
})
export class LeadService {
	leads: Lead[] = [];

	_leads: any = {};

	new(): Lead {
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
		this.leads = mongo.get('lead', {}, (arr: any, obj: any) => {
			this._leads = obj;
		});
	}

	create(
		lead: Lead = this.new(),
		callback = (created: Lead) => {},
		text = 'lead has been created.'
	) {
		if (lead._id) {
			this.save(lead);
		} else {
			this.mongo.create('lead', lead, (created: Lead) => {
				callback(created);
				this.alert.show({ text });
			});
		}
	}

	doc(leadId: string): Lead {
		if(!this._leads[leadId]){
			this._leads[leadId] = this.mongo.fetch('lead', {
				query: {
					_id: leadId
				}
			});
		}
		return this._leads[leadId];
	}

	update(
		lead: Lead,
		callback = (created: Lead) => {},
		text = 'lead has been updated.'
	): void {
		this.mongo.afterWhile(lead, ()=> {
			this.save(lead, callback, text);
		});
	}

	save(
		lead: Lead,
		callback = (created: Lead) => {},
		text = 'lead has been updated.'
	): void {
		this.mongo.update('lead', lead, () => {
			if(text) this.alert.show({ text, unique: lead });
		});
	}

	delete(
		lead: Lead,
		callback = (created: Lead) => {},
		text = 'lead has been deleted.'
	): void {
		this.mongo.delete('lead', lead, () => {
			if(text) this.alert.show({ text });
		});
	}
}
