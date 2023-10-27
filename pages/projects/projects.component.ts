import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import { ProjectService, Project } from "src/app/modules/project/services/project.service";
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { AlertService, CoreService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';

@Component({
	templateUrl: './projects.component.html',
	styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
	columns = ['name', 'description'];

	form: FormInterface = this._form.getForm('project', {
		formId: 'project',
		title: 'Project',
		components: [
			{
				name: 'Text',
				key: 'name',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill project title'
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
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill project title'
					},
					{
						name: 'Label',
						value: 'Title'
					}
				]
			}
		]
	});

	config = {
		create: () => {
			this._form
				.modal<Project>(this.form, {
					label: 'Create',
					click: (created: unknown, close: () => void) => {
						this._ps.create(created as Project);
						close();
					}
				})
				.then(this._ps.create.bind(this));
		},
		update: (doc: Project) => {
			this._form
				.modal<Project>(this.form, [], doc)
				.then((updated: Project) => {
					this._core.copy(updated, doc);
					this._ps.save(doc);
				});
		},
		delete: (doc: Project) => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this project?'
				),
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
		},
		buttons: [
			{
				hrefFunc: (element: Project) => {
					return `/project/${element._id}/leads`;
				},
				icon: 'recent_actors'
			},
			{
				hrefFunc: (element: Project) => {
					return `/project/${element._id}/clients`;
				},
				icon: 'groups'
			}
		]
	};

	get rows(): Project[] {
		return this._ps.projects;
	}

	constructor(
		private _form: FormService,
		private _ps: ProjectService,
		private _alert: AlertService,
		private _translate: TranslateService,
		private _core: CoreService
	) { }
}
