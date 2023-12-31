import { Component, OnInit } from '@angular/core';
import {
	IGetReportCategory,
	IOrganization,
	IReport,
	IReportCategory,
	PermissionsEnum
} from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from 'apps/gauzy/src/app/@core/services/store.service';
import { filter, tap } from 'rxjs/operators';
import { chain } from 'underscore';
import { ReportService } from '../report.service';

@UntilDestroy()
@Component({
	selector: 'ga-all-report',
	templateUrl: './all-report.component.html',
	styleUrls: ['./all-report.component.scss']
})
export class AllReportComponent implements OnInit {

	PermissionsEnum = PermissionsEnum;
	public organization: IOrganization;
	public loading: boolean;
	public reportCategories: IReportCategory[];

	constructor(
		private readonly reportService: ReportService,
		private readonly store: Store
	) { }

	ngOnInit(): void {
		this.store.selectedOrganization$
			.pipe(
				filter((organization: IOrganization) => !!organization),
				tap((organization: IOrganization) => this.organization = organization),
				tap(() => this.getReports()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	updateShowInMenu(isEnabled: boolean, report): void {
		const { tenantId } = this.store.user;
		const { id: organizationId } = this.organization;
		this.reportService
			.updateReport({
				reportId: report.id,
				organizationId,
				tenantId,
				isEnabled
			})
			.then(() => {
				this.reportService.getReportMenuItems({
					organizationId,
					tenantId
				});
			});
	}

	/**
	 * Organization all reports
	 *
	 * @returns
	 */
	async getReports() {
		if (!this.organization) {
			return false;
		}
		try {
			this.loading = true;

			const { id: organizationId, tenantId } = this.organization;
			const request: IGetReportCategory = {
				organizationId,
				tenantId,
				relations: ['category'],
			};

			const { items = [] } = await this.reportService.getReports(request);

			const categories = chain(items).groupBy('categoryId');
			this.reportCategories = categories
				.map((reports: IReport[]) => ({
					...reports[0].category,
					reports
				}))
				.value();
		} catch (error) {
			console.log('Error while retriving report with category', error);
		} finally {
			this.loading = false;
		}
	}
}
