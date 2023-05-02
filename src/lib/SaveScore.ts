import { SupabaseClient } from '@supabase/supabase-js';
import { RoomGameStatus, RoomStatus } from '@src/types';

type SaveScoreInput = {
	roomGameId: string;
	playerId: string;
	score: number;
};

type RoomGame = {
	id: string;
	room: {
		id: string;
	};
	scores: {
		playerId: string;
	}[];
};

export class SaveScoreHelper {
	private supabase: SupabaseClient;
	private input!: SaveScoreInput;
	private roomGame!: RoomGame;

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase;
	}

	private async getRoomGame() {
		const { data } = await this.supabase
			.from('room_games')
			.select('id, room:rooms ( id ), scores:room_scores(  playerId: player_id )')
			.eq('status', RoomGameStatus.CREATED)
			.eq('id', this.input.roomGameId)
			.single()
			.throwOnError();
		this.roomGame = data as RoomGame;
	}

	private validateNewScore() {
		if (this.roomGame.scores.findIndex(({ playerId }) => playerId === this.input.playerId) !== -1) {
			throw Error('Already played');
		}
	}

	private async addScore() {
		this.validateNewScore();

		await this.supabase
			.from('room_scores')
			.insert({
				room_game_id: this.input.roomGameId,
				room_id: this.roomGame.room.id,
				player_id: this.input.playerId,
				score: this.input.score,
			})
			.select('playerId: player_id')
			.single()
			.throwOnError();
	}

	async saveScore(input: SaveScoreInput) {
		this.input = input;
		await this.getRoomGame();
		await this.addScore();
	}
}
