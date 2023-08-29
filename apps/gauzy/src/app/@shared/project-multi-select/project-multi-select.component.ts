import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnInit,
	forwardRef,
	OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { filter, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	IDateRangePicker,
	IOrganization,
	IOrganizationProject,
} from '@gauzy/contracts';
import {
	OrganizationProjectsService,
	Store,
} from '../../@core';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-project-multi-select',
	templateUrl: './project-multi-select.component.html',
	styleUrls: ['./project-multi-select.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ProjectMultiSelectComponent),
			multi: true,
		},
	],
})
export class ProjectMultiSelectComponent implements OnInit, OnDestroy {
	loaded: boolean;
	preSelected: IOrganizationProject[];
	@Input()
	public allProjects: IOrganizationProject[];
	@Input()
	public set reset(value: boolean | null) {
		if (value) {
			if (this.multiple) {
				this.select.setValue([]);
				this.select.updateValueAndValidity();
			} else {
				this.select.reset();
			}
		}
	}

	@Input()
	public get selectedProjects(): IOrganizationProject[] {
		return this.select.value;
	}
	public set selectedProjects(value: IOrganizationProject[]) {
		this.preSelected = value;
		this.select.setValue(value);
		this.select.updateValueAndValidity();
	}

	constructor(
		private readonly projectsService: OrganizationProjectsService,
		private readonly store: Store,
	) { }

	@Output() selectedChange = new EventEmitter();
	@Output() onLoadProjects = new EventEmitter();

	@Input() multiple = true;
	@Input() label = 'FORM.PLACEHOLDERS.ADD_REMOVE_PROJECTS';
	@Input() disabled = false;
	@Input() placeholder = 'FORM.PLACEHOLDERS.ADD_REMOVE_PROJECTS';
	select: FormControl = new FormControl();

	private _allProjects: IOrganizationProject[];
	public organization: IOrganization;
	public selectedDateRange: IDateRangePicker;

	ngOnInit(): void {
		this.select.valueChanges
			.pipe(
				tap((value) => (this.selectedProjects = value)),
				untilDestroyed(this)
			)
			.subscribe();

		const storeOrganization$ = this.store.selectedOrganization$;
		storeOrganization$
			.pipe(
				filter((organization) => !!organization),
				tap((organization) => {
					this.organization = organization;
				}),
				tap(() => {
					if (!this.allProjects || this.allProjects.length === 0) {
						this.getProjects();
					}
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	onProjectSelected(selectEvent: any): void {
		this.selectedChange.emit(selectEvent);
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	private async getProjects(): Promise<void> {
		if (!this.organization) {
			return;
		}
		const { tenantId } = this.store.user;
		const { id: organizationId } = this.organization;

		const { items = [] } = await this.projectsService.getAll([], {
			organizationId,
			tenantId,
		});

		this._allProjects = items;
	}

	ngOnDestroy(): void { }
}
