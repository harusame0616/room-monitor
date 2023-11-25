import { D1SensingRepository } from './infrastructures/d1-sensing.repository';
import { RemoSensingClient } from './infrastructures/remo-sensing-client';
import { SensingRecordUsecase } from './usecases/sensing-record.usecase';

export interface Env {
	ROOM_MONITOR_DB: D1Database;
	REMO_TOKEN?: string;
}

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		if (!env.REMO_TOKEN) {
			console.error('REMO_TOKEN が設定されていません。環境変数を確認してください');
			return;
		}

		try {
			const usecase = new SensingRecordUsecase({
				sensingRepository: new D1SensingRepository(env.ROOM_MONITOR_DB),
				sensingClient: new RemoSensingClient({ token: env.REMO_TOKEN }),
			});

			await usecase.execute();
		} catch (e: unknown) {
			console.error(e);
		}
	},
};
