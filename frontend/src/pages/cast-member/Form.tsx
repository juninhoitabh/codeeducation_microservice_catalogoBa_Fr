import * as React from 'react';
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import SubmitActions from '../../components/SubmitActionsProps';
import castMemberHttp from '../../util/http/castMemberHttp';
import { CastMember } from '../../util/models';
import * as yup from '../../util/vendor/yup';

const validationSchema = yup.object().shape({
	name: yup.string().label('Nome').required().max(255),
	type: yup.number().label('Tipo').required(),
});

export const Form = () => {
	const snackbar = useSnackbar();
	const history = useHistory();
	const { id } = useParams<{ id }>();
	const [castMember, setCastMember] = useState<CastMember | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const { register, handleSubmit, getValues, setValue, reset, errors, watch, triggerValidation } = useForm({
		validationSchema,
	});

	useEffect(() => {
		if (!id) {
			return;
		}

		let isSubscribed = true;
		(async function getcastMembers() {
			setLoading(true);
			try {
				const { data } = await castMemberHttp.get(id);
				if (isSubscribed) {
					setCastMember(data.data);
					reset(data.data);
				}
			} catch (error) {
				console.error(error);
				snackbar.enqueueSnackbar('Não foi possível carregar as informações', { variant: 'error' });
			} finally {
				setLoading(false);
			}
		})();

		return () => {
			isSubscribed = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		register({ name: 'type' });
	}, [register]);

	async function onSubmit(formData, event) {
		setLoading(true);
		try {
			const http = !castMember ? castMemberHttp.create(formData) : castMemberHttp.update(castMember.id, formData);
			const { data } = await http;
			snackbar.enqueueSnackbar('Membro de elenco salva com sucesso', { variant: 'success' });
			setTimeout(() => {
				event ? (id ? history.replace(`/cast-members/${data.data.id}/edit`) : history.push(`/cast-members/${data.data.id}/edit`)) : history.push('/cast-members');
			});
		} catch (error) {
			console.error(error);
			snackbar.enqueueSnackbar('Não foi possivel salvar o Membro de elenco', { variant: 'error' });
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<TextField name='name' label='Nome' fullWidth variant={'outlined'} inputRef={register} disabled={loading} error={errors.name !== undefined} helperText={errors.name && errors.name.message} InputLabelProps={{ shrink: true }} />
			<FormControl error={errors.type !== undefined} disabled={loading} margin={'normal'}>
				<FormLabel component={'legend'}>Tipo</FormLabel>
				<RadioGroup
					name='type'
					onChange={(e) => {
						setValue('type', parseInt(e.target.value, 10));
					}}
					value={watch('type') + ''}>
					<FormControlLabel value='1' control={<Radio color={'primary'} />} label='Diretor' />
					<FormControlLabel value='2' control={<Radio color={'primary'} />} label='Ator' />
				</RadioGroup>
				{errors.type ? <FormHelperText id='type-helper-text'>{errors.type.message}</FormHelperText> : null}
			</FormControl>

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
