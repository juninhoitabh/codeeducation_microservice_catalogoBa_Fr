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
		label: 'Listar Categorias',
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
		name: 'categories.edit',
		label: 'Editar categoria',
		path: '/categories/:id/edit',
		component: CategoryForm,
		exact: true,
	},
	{
		name: 'cast_members.list',
		label: 'Listar Membros de elenco',
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
		name: 'cast_members.edit',
		label: 'Editar membro de elenco',
		path: '/cast-members/:id/edit',
		component: CastMemberForm,
		exact: true,
	},
	{
		name: 'genres.list',
		label: 'Listar Gêneros',
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
	{
		name: 'genres.edit',
		label: 'Editar gênero',
		path: '/genres/:id/edit',
		component: GenreForm,
		exact: true,
	},
];

export default routes;
