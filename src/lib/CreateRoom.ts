import { SupabaseClient } from '@supabase/supabase-js';
import { getRandomNumber } from '@src/utils';
import { StartGameHelper } from '@src/lib';

type CreateRoomInput = {
	gameRounds: number;
	ownerName: string;
	isMultiplayer: boolean;
};

export class CreateRoomHelper {
	private supabase: SupabaseClient;
	private input!: CreateRoomInput;
	private roomId?: string;
	private ownerId?: string;
	private static MAX_FLIPPED_ITEMS = 6;

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase;
	}

	private async createRoom() {
		const { data } = await this.supabase
			.from('rooms')
			.insert({ rounds: this.input.gameRounds })
			.select()
			.single()
			.throwOnError();

		this.roomId = data?.id;
	}

	private async loadRoomGames() {
		await this.supabase
			.from('room_games')
			.insert(
				[...Array(this.input.gameRounds).keys()].map(() => ({
					room_id: this.roomId,
					status: 1,
					flipped_items: getRandomNumber(CreateRoomHelper.MAX_FLIPPED_ITEMS, 2),
				}))
			)
			.throwOnError();
	}

	private async createRoomOwner() {
		const { data } = await this.supabase
			.from('room_players')
			.insert({
				room_id: this.roomId,
				player_name: this.input.ownerName,
				is_owner: true,
			})
			.select()
			.single()
			.throwOnError();

		this.ownerId = data?.id;
	}

	private async startSinglePlayerRoom() {
		await StartGameHelper.fromClient(this.supabase).startGame({ roomId: String(this.roomId) });
	}

	async initializeRoom(input: CreateRoomInput) {
		this.input = input;
		await this.createRoom();
		await Promise.all([this.loadRoomGames(), this.createRoomOwner()]);
		if (!this.input.isMultiplayer) {
			await this.startSinglePlayerRoom();
		}

		return { roomId: this.roomId, playerId: this.ownerId, isMultiplayer: this.input.isMultiplayer };
	}
}
