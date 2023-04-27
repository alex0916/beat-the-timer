import { RoomGameStatus, RoomStatus } from '@src/types';
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
			.select('id, room:rooms ( id, participants, rounds, roundsPlayed:rounds_played )')
			.eq('status', RoomGameStatus.CREATED)
			.eq('id', this.input.roomGameId)
			.single()
			.throwOnError();

		this.roomGame = data as RoomGame;
	}

	private async addScore() {
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

	private async updateRoundsPlayed() {
		const roundsPlayed = this.roomGame.room.roundsPlayed + 1;

		await this.supabase
			.from('rooms')
			.update({
				rounds_played: roundsPlayed,
				...(roundsPlayed === this.roomGame.room.rounds && { status: RoomStatus.FINISHED }),
			})
			.eq('id', this.roomGame.room.id)
			.throwOnError();
	}

	private async updateRoomGameStatus() {
		await this.supabase
			.from('room_games')
			.update({ status: RoomGameStatus.FINISHED })
			.eq('id', this.input.roomGameId)
			.throwOnError();
	}

	private async checkRoomGameUpdate() {
		const { data: scores } = await this.supabase
			.from('room_scores')
			.select()
			.eq('room_game_id', this.roomGame.id)
			.throwOnError();

		if (this.roomGame.room.participants === scores?.length) {
			await Promise.all([this.updateRoundsPlayed(), this.updateRoomGameStatus()]);
		}
	}

	async saveScore(input: SaveScoreInput) {
		this.input = input;
		await this.getRoomGame();
		await this.addScore();
		await this.checkRoomGameUpdate();
	}
}
