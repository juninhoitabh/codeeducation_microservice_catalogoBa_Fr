import * as React from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from '../../util/vendor/yup';
import categoryHttp from '../../util/http/categoryHttp';
import genreHttp from '../../util/http/genreHttp';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';
import { Category, Genre } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import LoadingContext from '../../components/loading/LoadingContext';

const validationSchema = yup.object().shape({
	name: yup.string().label('Nome').required().max(255),
	categories_id: yup.array().label('Categorias').required(),
});

export const Form = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [genre, setGenre] = useState<Genre | null>(null);
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();
	const { id } = useParams<{ id }>();
	const loading = useContext(LoadingContext);

	const { register, handleSubmit, getValues, setValue, watch, errors, reset, triggerValidation } = useForm<{ name; categories_id }>({
		validationSchema,
		defaultValues: {
			categories_id: [],
		},
	});

	useEffect(() => {
		let isSubscribed = true;
		(async () => {
			const promises = [categoryHttp.list({ queryParams: { all: '' } })];
			if (id) {
				promises.push(genreHttp.get(id));
			}
			try {
				const [categoriesResponse, genreResponse] = await Promise.all(promises);
				if (isSubscribed) {
					setCategories(categoriesResponse.data.data);
					if (id) {
						setGenre(genreResponse.data.data);
						const categories_id = genreResponse.data.data.categories.map((category) => category.id);
						reset({ ...genreResponse.data.data, categories_id });
					}
				}
			} catch (error) {
				console.error(error);
				enqueueSnackbar('Não foi possível carregar as informações', { variant: 'error' });
			}
		})();

		return () => {
			isSubscribed = false;
		};
	}, [enqueueSnackbar, id, reset]);

	useEffect(() => {
		register({ name: 'categories_id' });
	}, [register]);

	async function onSubmit(formData, event) {
		try {
			const http = !genre ? genreHttp.create(formData) : genreHttp.update(genre.id, formData);
			const { data } = await http;
			enqueueSnackbar('Gênero salvo com sucesso', { variant: 'success' });
			setTimeout(() => {
				event ? (id ? history.replace(`/genres/${data.data.id}/edit`) : history.push(`/genres/${data.data.id}/edit`)) : history.push('/genres');
			});
		} catch (error) {
			console.error(error);
			enqueueSnackbar('Não foi possivel salvar o gênero', { variant: 'error' });
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<TextField name='name' label='Nome' fullWidth variant={'outlined'} inputRef={register} disabled={loading} error={errors.name !== undefined} helperText={errors.name && errors.name.message} InputLabelProps={{ shrink: true }} />
			<TextField
				select
				name='categories_id'
				value={watch('categories_id') ?? []}
				label='Categorias'
				margin={'normal'}
				variant={'outlined'}
				fullWidth
				onChange={(e) => {
					setValue('categories_id', e.target.value);
				}}
				SelectProps={{ multiple: true }}
				disabled={loading}
				error={errors.categories_id !== undefined}
				helperText={errors.categories_id && errors.categories_id.message}
				InputLabelProps={{ shrink: true }}>
				<MenuItem value='' disabled>
					<em>Selecione categorias</em>
				</MenuItem>
				{categories.map((category, key) => (
					<MenuItem key={key} value={category.id}>
						{category.name}
					</MenuItem>
				))}
			</TextField>

			<SubmitActions
				disabledButtons={loading}
				handleSave={() =>
					triggerValidation().then((isValid) => {
						isValid && onSubmit(getValues(), null);
					})
				}
			/>
		</form>
	);
};
