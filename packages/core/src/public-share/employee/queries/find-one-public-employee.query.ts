import { IQuery } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Employee } from '../../../core/entities/internal';

export class FindOnePublicEmployeeQuery implements IQuery {

	constructor(
		public readonly params: FindOptionsWhere<Employee>,
		public readonly relations: string[]
	) {}
}