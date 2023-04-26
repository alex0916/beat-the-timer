import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { useRoomContext } from '@src/contexts';
import { useActionHelper } from '@src/hooks';
import { JoinRoomHelper } from '@src/lib';

type Inputs = {
	playerName: string;
};

export const JoinRoom = () => {
	const router = useRouter();
	const { room } = useRoomContext();
	const joinRoomHelper = useActionHelper(JoinRoomHelper);

	const { isLoading, mutate } = useMutation({
		mutationFn: async (input: Inputs) => {
			return await joinRoomHelper.joinRoom({ ...input, roomId: room!.id });
		},
		onSuccess(data) {
			router.push(`/room/${room?.id}/player/${data.playerId}`);
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			playerName: '',
		},
	});

	// @TODO handle mutate error
	return (
		<div className="grid">
			<div className="col-12">
				<h1 className="text-center">Enter your username and join the room 🎲</h1>
			</div>
			<form className="flex-1 flex-column" onSubmit={handleSubmit((input) => mutate(input))}>
				<Controller
					name="playerName"
					control={control}
					rules={{ required: 'Name is required.' }}
					render={({ field }) => (
						<div className="flex flex-column gap-2 mb-4">
							<label htmlFor="player-name">Player name</label>
							<InputText
								id="player-name"
								autoComplete="off"
								value={field.value}
								onChange={(e) => field.onChange(e.target.value)}
							/>
							{errors.playerName ? <small>Enter valid player name</small> : null}
						</div>
					)}
				/>
				<Button loading={isLoading} className="w-full" type="submit" label="Join Room" />
			</form>
		</div>
	);
};
