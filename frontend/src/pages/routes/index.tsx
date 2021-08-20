import { RouteProps } from 'react-router-dom';
import Dashboard from '../Dashboard';
import CategoryList from '../category/PageList';
import CategoryForm from '../category/PageForm';
import CastMemberList from '../cast-member/PageList';
import CastMemberForm from '../cast-member/PageForm';
import GenreList from '../genre/PageList';
import GenreForm from '../genre/PageForm';

export interface MyRouteProps extends RouteProps {
	name: string;
	label: string;
}

const routes: MyRouteProps[] = [
	{
		name: 'dashboard',
		label: 'Dashboard',
		path: '/',
		component: Dashboard,
		exact: true,
	},
	{
		name: 'categories.list',
		label: 'Listar categorias',
		path: '/categories',
		component: CategoryList,
		exact: true,
	},
	{
		name: 'categories.create',
		label: 'Criar categorias',
		path: '/categories/create',
		component: CategoryForm,
		exact: true,
	},
	{
		name: 'cast_members.list',
		label: 'Listar membros de elencos',
		path: '/cast-members',
		component: CastMemberList,
		exact: true,
	},
	{
		name: 'cast_members.create',
		label: 'Criar membro de elenco',
		path: '/cast-members/create',
		component: CastMemberForm,
		exact: true,
	},
	{
		name: 'genres.list',
		label: 'Listar gêneros',
		path: '/genres',
		component: GenreList,
		exact: true,
	},
	{
		name: 'genres.create',
		label: 'Criar gênero',
		path: '/genres/create',
		component: GenreForm,
		exact: true,
	},
];

export default routes;
