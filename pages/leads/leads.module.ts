import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { LeadsComponent } from './leads.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: LeadsComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		LeadsComponent
	],
	providers: []

})

export class LeadsModule { }
