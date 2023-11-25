import { Sensing, SensingClient } from '../usecases/sensing-client';

class AuthorizationError extends Error {
	constructor() {
		super('認証エラーです');
	}
}
type ConstructorProps = {
	token: string;
	endpoint?: string;
};

type DeviceResponse = {
	bt_mac_address: string;
	created_at: string;
	firmware_version: string;
	humidity_offset: number;
	id: string;
	mac_address: string;
	name: string;
	newest_events: {
		[additionalProp: string]: {
			created_at: string;
			val: number;
		};
	};
	online: boolean;
	serial_number: string;
	temperature_offset: number;
	updated_at: string;
	users: {
		id: string;
		nickname: string;
		superuser: boolean;
	}[];
};

/**
 * 絶対湿度を計算する
 *
 * @param relativeHumidity 相対湿度 (%rh)
 * @param temperature 温度 (℃)
 * @param pressure 気圧 (hPa) デフォルトは標準大気圧(1013.25)
 * @returns 絶対湿度 (g/m^3)
 */
function calculateAbsoluteHumidity(relativeHumidity: number, temperature: number, pressure: number = 1013.25) {
	// Calculate saturation vapor pressure (in hPa)
	const saturationVaporPressure = 6.1078 * Math.exp((17.27 * temperature) / (temperature + 237.3));

	// Calculate absolute humidity (in g/m^3)
	const absoluteHumidity = (217 * ((relativeHumidity / 100) * saturationVaporPressure)) / (temperature + 273.15);

	return absoluteHumidity;
}

export class RemoSensingClient implements SensingClient {
	private readonly endpoint = new URL('https://api.nature.global/1/devices');
	private readonly token: string;

	constructor({ token, endpoint }: ConstructorProps) {
		this.token = token;
		this.endpoint = endpoint ? new URL(endpoint) : this.endpoint;
	}

	async fetchDevices(): Promise<DeviceResponse[]> {
		const res = await fetch(this.endpoint, {
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		});
		if (!res.ok) {
			if (res.status === 401 && res.statusText === 'Unauthorized') {
				throw new AuthorizationError();
			}
			throw new Error('不明なエラーです');
		}

		return await res.json<DeviceResponse[]>();
	}

	static deviceToSensor(device: DeviceResponse): Sensing {
		return {
			sensingId: crypto.randomUUID(),
			deviceId: device.id,
			name: device.name,
			absoluteHumidity: {
				recordedAt: new Date(),
				value: calculateAbsoluteHumidity(device.newest_events.hu.val, device.newest_events.te.val),
			},
			relativeHumidity: {
				recordedAt: new Date(device.newest_events.hu.created_at),
				value: device.newest_events.hu.val,
			},
			temperature: {
				recordedAt: new Date(device.newest_events.te.created_at),
				value: device.newest_events.te.val,
			},
		};
	}

	async fetch(): Promise<Sensing[]> {
		const devices = await this.fetchDevices();
		return devices.map(RemoSensingClient.deviceToSensor);
	}
}
