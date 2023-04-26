import { Layout } from '@src/components/Layout';
import { JoinRoom, RoomHandler } from '@src/components/Room';

export default function JoinRoomPage() {
	return (
		<Layout>
			<RoomHandler>
				<JoinRoom />
			</RoomHandler>
		</Layout>
	);
}
