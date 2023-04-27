import { SupabaseClient } from '@supabase/supabase-js';

export class ScoresHelper {
	private supabase: SupabaseClient;
	private roomId: string;

	constructor(supabase: SupabaseClient, roomId: string) {
		this.supabase = supabase;
		this.roomId = roomId;
	}

	static fromRoomId(supabase: SupabaseClient, roomId: string) {
		return new ScoresHelper(supabase, roomId);
	}

	async getScores() {
		const { data } = await this.supabase
			.rpc('get_scores', {
				room: this.roomId,
			})
			.throwOnError();

		return data;
	}
}
