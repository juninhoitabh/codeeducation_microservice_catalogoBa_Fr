import { Box, Button, ButtonProps, TextField, makeStyles, Theme, MenuItem } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from '../../util/vendor/yup';
import categoryHttp from '../../util/http/categoryHttp';
import genreHttp from '../../util/http/genreHttp';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => {
	return {
		submit: {
			margin: theme.spacing(1),
		},
	};
});

const validationSchema = yup.object().shape({
	name: yup.string().label('Nome').required().max(255),
	categories_id: yup.array().label('Categorias').required(),
});

export const Form = () => {
	const classes = useStyles();

	const [categories, setCategories] = useState<any[]>([]);
	const { register, handleSubmit, getValues, setValue, watch, errors, reset } = useForm<{ name; categories_id }>({
		validationSchema,
		defaultValues: {
			categories_id: [],
		},
	});

	const snackbar = useSnackbar();
	const history = useHistory();
	const { id } = useParams<{ id }>();
	const [genre, setGenre] = useState<{ id: null } | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const buttonProps: ButtonProps = {
		className: classes.submit,
		color: 'secondary',
		variant: 'contained',
		disabled: loading,
	};

	useEffect(() => {
		if (!id) {
			return;
		}

		setLoading(true);
		genreHttp
			.get(id)
			.then(({ data }) => {
				setGenre(data.data);
				reset(data.data);
			})
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		register({ name: 'categories_id' });
	}, [register]);

	useEffect(() => {
		categoryHttp.list().then(({ data }) => setCategories(data.data));
	}, []);

	function onSubmit(formData, event) {
		setLoading(true);
		const http = !genre ? genreHttp.create(formData) : genreHttp.update(genre.id, formData);

		http
			.then(({ data }) => {
				snackbar.enqueueSnackbar('Gênero salvo com sucesso', { variant: 'success' });

				setTimeout(() => {
					event ? (id ? history.replace(`/genres/${data.data.id}/edit`) : history.push(`/genres/${data.data.id}/edit`)) : history.push('/genres');
				});
			})
			.catch((error) => {
				console.log(error);
				snackbar.enqueueSnackbar('Não foi possivel salvar o genero', { variant: 'error' });
			})
			.finally(() => setLoading(false));
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
			<Box dir={'rtl'}>
				<Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>
					Salvar
				</Button>
				<Button {...buttonProps} type='submit'>
					Salvar e continuar editando
				</Button>
			</Box>
		</form>
	);
};
