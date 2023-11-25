import { Sensing } from '../usecases/sensing-client';
import { SensingRepository } from '../usecases/sensing.repository';

export class D1SensingRepository implements SensingRepository {
	constructor(private readonly db: D1Database) {}
	async save(sensing: Sensing): Promise<void> {
		await this.db
			.prepare('INSERT INTO SENSING (DEVICE_ID, RELATIVE_HUMIDITY, ABSOLUTE_HUMIDITY, TEMPERATURE) VALUES (?, ?, ?, ?)')
			.bind(sensing.id, sensing.relativeHumidity.value, sensing.absoluteHumidity.value, sensing.temperature.value)
			.run();
	}
}
