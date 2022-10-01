import { IQuery } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Invoice } from '../../../core/entities/internal';

export class FindPublicInvoiceQuery implements IQuery {

	constructor(
		public readonly params: FindOptionsWhere<Invoice>,
		public readonly relations: string[],
	) {}
}