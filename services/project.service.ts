import { Injectable } from '@angular/core';
import { MongoService, AlertService } from 'wacom';

export interface Project {
	_id: string;
	name: string;
	description: string;
}

@Injectable({
	providedIn: 'root'
})
export class ProjectService {
	projects: Project[] = [];

	_projects: any = {};

	new(): Project {
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
		this.projects = mongo.get('project', {}, (arr: any, obj: any) => {
			this._projects = obj;
		});
	}

	create(
		project: Project = this.new(),
		callback = (created: Project) => {},
		text = 'project has been created.'
	) {
		if (project._id) {
			this.save(project);
		} else {
			this.mongo.create('project', project, (created: Project) => {
				callback(created);
				this.alert.show({ text });
			});
		}
	}

	doc(projectId: string): Project {
		if(!this._projects[projectId]){
			this._projects[projectId] = this.mongo.fetch('project', {
				query: {
					_id: projectId
				}
			});
		}
		return this._projects[projectId];
	}

	update(
		project: Project,
		callback = (created: Project) => {},
		text = 'project has been updated.'
	): void {
		this.mongo.afterWhile(project, ()=> {
			this.save(project, callback, text);
		});
	}

	save(
		project: Project,
		callback = (created: Project) => {},
		text = 'project has been updated.'
	): void {
		this.mongo.update('project', project, () => {
			if(text) this.alert.show({ text, unique: project });
		});
	}

	delete(
		project: Project,
		callback = (created: Project) => {},
		text = 'project has been deleted.'
	): void {
		this.mongo.delete('project', project, () => {
			if(text) this.alert.show({ text });
		});
	}
}
