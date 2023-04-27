import { SupabaseClient } from '@supabase/supabase-js';

type StartGameInput = {
	roomId: string;
};

export class StartGameHelper {
	private supabase: SupabaseClient;
	private input!: StartGameInput;

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase;
	}

	static fromClient(supabase: SupabaseClient) {
		return new StartGameHelper(supabase);
	}

	private async getParticipants() {
		const { count: participants } = await this.supabase
			.from('room_players')
			.select('*', { count: 'exact', head: true })
			.eq('room_id', this.input.roomId)
			.throwOnError();

		return participants;
	}

	async startGame(input: StartGameInput) {
		this.input = input;
		const participants = await this.getParticipants();
		await this.supabase
			.from('rooms')
			.update({ status: 2, participants })
			.eq('id', this.input.roomId)
			.throwOnError();
	}
}
