import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Client {
	_id: string;
	name: string;
	description: string;
}

@Injectable({
	providedIn: 'root'
})
export class ClientService {
	clients: Client[] = [];

	_clients: any = {};

	new(): Client {
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
		this.clients = mongo.get('client', {}, (arr: any, obj: any) => {
			this._clients = obj;
		});
	}

	create(
		client: Client = this.new(),
		callback = (created: Client) => {},
		text = 'client has been created.'
	) {
		if (client._id) {
			this.save(client);
		} else {
			this.mongo.create('client', client, (created: Client) => {
				callback(created);
				this.alert.show({ text });
			});
		}
	}

	doc(clientId: string): Client {
		if(!this._clients[clientId]){
			this._clients[clientId] = this.mongo.fetch('client', {
				query: {
					_id: clientId
				}
			});
		}
		return this._clients[clientId];
	}

	update(
		client: Client,
		callback = (created: Client) => {},
		text = 'client has been updated.'
	): void {
		this.mongo.afterWhile(client, ()=> {
			this.save(client, callback, text);
		});
	}

	save(
		client: Client,
		callback = (created: Client) => {},
		text = 'client has been updated.'
	): void {
		this.mongo.update('client', client, () => {
			if(text) this.alert.show({ text, unique: client });
		});
	}

	delete(
		client: Client,
		callback = (created: Client) => {},
		text = 'client has been deleted.'
	): void {
		this.mongo.delete('client', client, () => {
			if(text) this.alert.show({ text });
		});
	}
}
