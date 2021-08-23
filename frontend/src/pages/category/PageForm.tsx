import { Form } from './Form';
import { Page } from '../../components/Page';
import { useParams } from 'react-router';

const PageForm = () => {
	const { id } = useParams<{ id }>();
	return (
		<Page title={!id ? 'Criar categoria' : 'Editar categoria'}>
			<Form />
		</Page>
	);
};

export default PageForm;
