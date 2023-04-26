import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

import { CreateRoomHelper } from '@src/lib';
import { useActionHelper } from '@src/hooks';

type Inputs = {
	gameRounds: number;
	ownerName: string;
};

export const CreateRoom = () => {
	const router = useRouter();
	const createRoomHelper = useActionHelper(CreateRoomHelper);

	const { isLoading, mutate } = useMutation({
		mutationFn: async (input: Inputs) => {
			return await createRoomHelper.initializeRoom(input);
		},
		onSuccess(data) {
			router.push(`room/${data.roomId}/player/${data.playerId}`);
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			gameRounds: 3,
			ownerName: '',
		},
	});

	return (
		<form className="grid" onSubmit={handleSubmit((input) => mutate(input))}>
			<div className="flex-1 flex-wrap flex-column">
				<h1 className="pb-4 text-center">Create a room and start playing 🎉</h1>
				<div className="grid">
					<Controller
						name="ownerName"
						control={control}
						rules={{ required: 'Room name is required.' }}
						render={({ field }) => (
							<div className="col-12 md:col-6 flex flex-column gap-2">
								<label htmlFor="player-name">Player name</label>
								<InputText
									id="player-name"
									autoComplete="off"
									value={field.value}
									onChange={(e) => field.onChange(e.target.value)}
								/>
								{errors.ownerName ? (
									<small className="text-red-500">Enter valid player name</small>
								) : null}
							</div>
						)}
					/>
					<Controller
						name="gameRounds"
						control={control}
						rules={{ required: 'Room name is required.' }}
						render={({ field }) => (
							<div className="col-12 md:col-6 flex flex-column gap-2">
								<label htmlFor="rounds">Rounds</label>
								<InputNumber
									value={field.value}
									onChange={(e) => field.onChange(e.value)}
									inputStyle={{ width: '-webkit-fill-available' }}
								/>
								{errors.gameRounds ? (
									<small className="text-red-500">Enter valid number of rounds</small>
								) : null}
							</div>
						)}
					/>
				</div>
				<Button loading={isLoading} className="my-4 w-full" label="Create Room" type="submit" />
			</div>
		</form>
	);
};
