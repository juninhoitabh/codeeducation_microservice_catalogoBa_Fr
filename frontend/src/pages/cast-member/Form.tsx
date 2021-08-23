import { Box, Button, ButtonProps, TextField, makeStyles, Theme, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import castMemberHttp from '../../util/http/castMemberHttp';
import * as yup from '../../util/vendor/yup';

const useStyles = makeStyles((theme: Theme) => {
	return {
		submit: {
			margin: theme.spacing(1),
		},
	};
});

const validationSchema = yup.object().shape({
	name: yup.string().label('Nome').required().max(255),
	type: yup.number().label('Tipo').required(),
});

export const Form = () => {
	const { register, handleSubmit, getValues, setValue, reset, errors, watch } = useForm({
		validationSchema,
	});

	const snackbar = useSnackbar();
	const history = useHistory();
	const { id } = useParams<{ id }>();
	const [castMember, setCastMember] = useState<{ id: null } | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const classes = useStyles();
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
		castMemberHttp
			.get(id)
			.then(({ data }) => {
				setCastMember(data.data);
				reset(data.data);
			})
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		register({ name: 'type' });
	}, [register]);

	function onSubmit(formData, event) {
		setLoading(true);
		const http = !castMember ? castMemberHttp.create(formData) : castMemberHttp.update(castMember.id, formData);

		http
			.then(({ data }) => {
				snackbar.enqueueSnackbar('Membro de elenco salva com sucesso', { variant: 'success' });

				setTimeout(() => {
					event ? (id ? history.replace(`/cast-members/${data.data.id}/edit`) : history.push(`/cast-members/${data.data.id}/edit`)) : history.push('/cast-members');
				});
			})
			.catch((error) => {
				console.log(error);
				snackbar.enqueueSnackbar('Não foi possivel salvar a Membro de elenco', { variant: 'error' });
			})
			.finally(() => setLoading(false));
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
