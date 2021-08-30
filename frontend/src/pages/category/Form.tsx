import { Checkbox, TextField, FormControlLabel } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/categoryHttp';
import * as yup from '../../util/vendor/yup';
import { useHistory, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Category } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import { DefaultForm } from '../../components/DefaultForm';
import LoadingContext from '../../components/loading/LoadingContext';

const validationSchema = yup.object().shape({
	name: yup.string().label('Nome').required().max(255),
});

export const Form = () => {
	const { enqueueSnackbar } = useSnackbar();
	const history = useHistory();
	const { id } = useParams<{ id }>();
	const [category, setCategory] = useState<Category | null>(null);
	const loading = useContext(LoadingContext);

	const { register, handleSubmit, getValues, errors, reset, setValue, watch, triggerValidation } = useForm<{ name; is_active }>({
		validationSchema,
		defaultValues: {
			is_active: true,
		},
	});

	useEffect(() => {
		if (!id) {
			return;
		}

		let isSubscribed = true;
		(async function getCategory() {
			try {
				const { data } = await categoryHttp.get(id);
				if (isSubscribed) {
					setCategory(data.data);
					reset(data.data);
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
		register({ name: 'is_active' });
	}, [register]);

	async function onSubmit(formData, event) {
		try {
			const http = !category ? categoryHttp.create(formData) : categoryHttp.update(category.id, formData);
			const { data } = await http;
			enqueueSnackbar('Categoria salva com sucesso', { variant: 'success' });
			setTimeout(() => {
				event ? (id ? history.replace(`/categories/${data.data.id}/edit`) : history.push(`/categories/${data.data.id}/edit`)) : history.push('/categories');
			});
		} catch (error) {
			console.error(error);
			enqueueSnackbar('Não foi possivel salvar a categoria', { variant: 'error' });
		}
	}

	return (
		<DefaultForm GridItemProps={{ xs: 12, md: 6 }} onSubmit={handleSubmit(onSubmit)}>
			<TextField name='name' label='Nome' fullWidth variant={'outlined'} inputRef={register} disabled={loading} error={errors.name !== undefined} helperText={errors.name && errors.name.message} InputLabelProps={{ shrink: true }} />
			<TextField name='description' label='Descrição' multiline rows='4' fullWidth variant={'outlined'} margin={'normal'} inputRef={register} disabled={loading} InputLabelProps={{ shrink: true }} />
			<FormControlLabel disabled={loading} control={<Checkbox name='is_active' color={'primary'} onChange={() => setValue('is_active', !getValues()['is_active'])} checked={watch('is_active')} />} label={'Ativo?'} labelPlacement={'end'} />

			<SubmitActions
				disabledButtons={loading}
				handleSave={() =>
					triggerValidation().then((isValid) => {
						isValid && onSubmit(getValues(), null);
					})
				}
			/>
		</DefaultForm>
	);
};
