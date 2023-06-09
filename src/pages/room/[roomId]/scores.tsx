import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import Error from '@src/components/Error';
import Loading from '@src/components/Loading';
import { useScoresHelper } from '@src/hooks';

export default function RoomScores() {
	const router = useRouter();
	const scoresHelper = useScoresHelper();

	const {
		isLoading,
		isIdle,
		error,
		data: scores,
	} = useQuery(
		['scores'],
		async () => {
			return await scoresHelper.getScores();
		},
		{ enabled: !!scoresHelper }
	);

	const handleGoBack = () => {
		router.push('/');
	};

	if (isLoading || isIdle) {
		return <Loading message="Loading scores" />;
	}

	if (error) {
		return <Error />;
	}

	return (
		<div className="grid">
			<h1 className="flex align-items-center justify-content-center w-full mb-3">🏅 Scores 🏅</h1>
			<DataTable value={scores} className="w-full">
				<Column field="name" header="Player" align="center"></Column>
				<Column field="score" header="Score" align="center"></Column>
			</DataTable>
			<Button className="mt-4 w-full" size="large" label="Go Back" onClick={handleGoBack} />
		</div>
	);
}
