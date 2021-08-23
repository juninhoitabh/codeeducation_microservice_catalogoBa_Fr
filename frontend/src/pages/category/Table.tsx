import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import categoryHttp from '../../util/http/categoryHttp';
import { BadgeNo, BadgeYes } from '../../components/Badge';

const columnsDefinition: MUIDataTableColumn[] = [
	{
		name: 'name',
		label: 'Nome',
	},
	{
		name: 'is_active',
		label: 'Ativo?',
		options: {
			filterOptions: {
				names: ['Sim', 'Não'],
			},
			customBodyRender(value, tableMeta, updateValue) {
				return value ? <BadgeYes /> : <BadgeNo />;
			},
		},
	},
	{
		name: 'created_at',
		label: 'Criado em',
		options: {
			filter: false,
			customBodyRender(value, tableMeta, updateValue) {
				return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>;
			},
		},
	},
];

interface Category {
	id: string;
	name: string;
}

type Props = {};
const Table = (props: Props) => {
	const [data, setData] = useState<Category[]>([]);

	useEffect(() => {
		categoryHttp.list<{ data: Category[] }>().then(({ data }) => setData(data.data));
	}, []);

	return <MUIDataTable title='Listagem de Categorias' columns={columnsDefinition} data={data} />;
};

export default Table;
