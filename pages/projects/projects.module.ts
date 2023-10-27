import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core';
import { ProjectsComponent } from './projects.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: ProjectsComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		ProjectsComponent
	],
	providers: []

})

export class ProjectsModule { }
