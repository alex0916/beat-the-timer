import { Message } from 'primereact/message';

export default function Error() {
	return <Message className="my-3 w-full" severity="error" text="Oops.. something bad happened" />;
}
