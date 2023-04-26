import { SupabaseClient } from '@supabase/supabase-js';

type SaveScoreInput = {
	roomGameId: string;
	playerId: string;
	score: number;
};

type RoomGame = {
	id: string;
	room: {
		id: string;
		participants: number;
		rounds: number;
		roundsPlayed: number;
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
			.select(
				'id, room:rooms ( id, participants, roundsPlayed:rounds_played ), scores:room_scores ( playerId:player_id )'
			)
			.eq('status', 1)
			.eq('id', this.input.roomGameId)
			.single()
			.throwOnError();

		this.roomGame = data as RoomGame;
	}

	private validateScore() {
		if (this.roomGame.scores.findIndex((score) => score.playerId === this.input.playerId) !== -1) {
			throw new Error('User already played');
		}
	}

	private async addScore() {
		this.validateScore();

		const { data } = await this.supabase
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

		this.roomGame.scores = [
			...this.roomGame.scores,
			data as {
				playerId: string;
			},
		];
	}

	private async updateRoundsPlayed() {
		await this.supabase
			.from('rooms')
			.update({ rounds_played: this.roomGame.room.roundsPlayed + 1 })
			.eq('id', this.roomGame.room.id)
			.throwOnError();
	}

	private async updateRoomGameStatus() {
		await this.supabase
			.from('room_games')
			.update({ status: 2 })
			.eq('id', this.input.roomGameId)
			.throwOnError();
	}

	async saveScore(input: SaveScoreInput) {
		this.input = input;
		await this.getRoomGame();
		await this.addScore();
		if (this.roomGame.room.participants === this.roomGame.scores.length) {
			await Promise.all([this.updateRoundsPlayed(), this.updateRoomGameStatus()]);
		}
	}
}
