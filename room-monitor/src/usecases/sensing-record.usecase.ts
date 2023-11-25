import { SensingClient } from './sensing-client';
import { SensingRepository } from './sensing.repository';

type ConstructorProps = {
	sensingClient: SensingClient;
	sensingRepository: SensingRepository;
};
export class SensingRecordUsecase {
	private readonly sensingClient: SensingClient;
	private readonly sensingRepository: SensingRepository;

	constructor({ sensingClient, sensingRepository }: ConstructorProps) {
		this.sensingClient = sensingClient;
		this.sensingRepository = sensingRepository;
	}
	async execute() {
		const sensings = await this.sensingClient.fetch();
		await Promise.all(sensings.map((sensing) => this.sensingRepository.save(sensing)));
	}
}
