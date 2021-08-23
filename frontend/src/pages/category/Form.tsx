import { Box, Button, ButtonProps, Checkbox, TextField, makeStyles, Theme, FormControlLabel } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/categoryHttp';
import * as yup from '../../util/vendor/yup';
import { useHistory, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => {
	return {
		submit: {
			margin: theme.spacing(1),
		},
	};
});

const validationSchema = yup.object().shape({
	name: yup.string().label('Nome').required().max(255),
});

export const Form = () => {
	const classes = useStyles();

	const { register, handleSubmit, getValues, errors, reset, setValue, watch } = useForm<{ name; is_active }>({
		validationSchema,
		defaultValues: {
			is_active: true,
		},
	});

	const snackbar = useSnackbar();
	const history = useHistory();
	const { id } = useParams<{ id }>();
	const [category, setCategory] = useState<{ id: null } | null>(null);
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
		categoryHttp
			.get(id)
			.then(({ data }) => {
				setCategory(data.data);
				reset(data.data);
			})
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		register({ name: 'is_active' });
	}, [register]);

	function onSubmit(formData, event) {
		setLoading(true);
		const http = !category ? categoryHttp.create(formData) : categoryHttp.update(category.id, formData);

		http
			.then(({ data }) => {
				snackbar.enqueueSnackbar('Categoria salva com sucesso', { variant: 'success' });

				setTimeout(() => {
					event ? (id ? history.replace(`/categories/${data.data.id}/edit`) : history.push(`/categories/${data.data.id}/edit`)) : history.push('/categories');
				});
			})
			.catch((error) => {
				console.log(error);
				snackbar.enqueueSnackbar('Não foi possivel salvar a categoria', { variant: 'error' });
			})
			.finally(() => setLoading(false));
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<TextField name='name' label='Nome' fullWidth variant={'outlined'} inputRef={register} disabled={loading} error={errors.name !== undefined} helperText={errors.name && errors.name.message} InputLabelProps={{ shrink: true }} />
			<TextField name='description' label='Descrição' multiline rows='4' fullWidth variant={'outlined'} margin={'normal'} inputRef={register} disabled={loading} InputLabelProps={{ shrink: true }} />
			<FormControlLabel disabled={loading} control={<Checkbox name='is_active' color={'primary'} onChange={() => setValue('is_active', !getValues()['is_active'])} checked={watch('is_active')} />} label={'Ativo?'} labelPlacement={'end'} />

			<Box dir={'rtl'}>
				<Button color={'primary'} {...buttonProps} onClick={() => onSubmit(getValues(), null)}>
					Salvar
				</Button>
				<Button {...buttonProps} type='submit'>
					Salvar e continuar editando
				</Button>
			</Box>
		</form>
	);
};
