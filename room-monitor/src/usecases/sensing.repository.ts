import { Sensing } from './sensing-client';

export interface SensingRepository {
	save(sensing: Sensing): Promise<void>;
}
