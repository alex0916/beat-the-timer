import { Layout } from '@src/components/Layout';
import { CreateRoom } from '@src/components/Room';

export default function HomePage() {
	return (
		<Layout>
			<CreateRoom />
		</Layout>
	);
}

// @TODO use server auth
// export const getServerSideProps = withAuth(async () => {
// 	return { props: {} };
// });
