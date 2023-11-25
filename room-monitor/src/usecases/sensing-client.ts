export type Sensing = {
	name: string;
	id: string;

	relativeHumidity: {
		value: number;
		recordedAt: Date;
	};
	absoluteHumidity: {
		value: number;
		recordedAt: Date;
	};
	temperature: {
		value: number;
		recordedAt: Date;
	};
};

export interface SensingClient {
	fetch(): Promise<Sensing[]>;
}
