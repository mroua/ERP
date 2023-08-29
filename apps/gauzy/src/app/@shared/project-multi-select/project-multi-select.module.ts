import { NgModule } from '@angular/core';
import { ProjectMultiSelectComponent } from './project-multi-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbSelectModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme';
import { SharedModule } from '../shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [
		ThemeModule,
		NbSelectModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModule,
		TranslateModule
	],
	declarations: [ProjectMultiSelectComponent],
	exports: [ProjectMultiSelectComponent],
	providers: []
})
export class ProjectMultiSelectModule { }
