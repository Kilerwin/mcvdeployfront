import { Grid, Modal } from '@mui/material'
import useForm from '../../Hooks/useForm'
import Input from '../admin/Input'
import Selects from '../admin/Selects'
import { useState } from 'react'
import Boton from '../dash/boton'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import InputDate from '../dash/inputDate'
import dayjs from 'dayjs'
import axios from 'axios';
import { useBringDocument } from '../../Hooks/useDocument';
import { getDataById } from '../../utils/getDataById';
import { emptyValidation, getPetsWithOwner } from '../../utils/getPetsWithOwner';
import { useHabilitar } from '../../Hooks/useHabilitar';
import Message from '../dash/succesfulMessage'
import { useTypeDespa } from '../../Hooks/useDespaType'
import { dateFormater } from '../../utils/dateFormater'
import PetsIcon from '@mui/icons-material/Pets';
import DeleteIcon from '@mui/icons-material/Delete';

const defaultValues = {
    idMascota: '',
    numeroDocumento: '',
    tipoDocumento: 'C.C',
    idTipoDesparacitacion: 'EXT',
    fecha_aplicacion_desparacitacion: dayjs(),
    fecha_vencimiento_desparacitacion: dayjs(),
    medicamento_aplicado: '',
    lote_desparacitacion: '',
    registro_ica: '',
    laboratorio_desparacitacion: '',
    estado_desparacitacion: 1,
}

export const FromAgregarDesparacitacion = (props) => {
    const { label, bgColor, icon, tooltip, id, actualizar, dato, successMessage,errorMessage } = props
    const { values, setValues, handleInputChange, handleInputChangeDate } = useForm(defaultValues)
    const [dataMascota, setDataMascota] = useState([])
    const [despaTypes] = useTypeDespa();
    const { desabilitado, validarId } = useHabilitar({ id })
    const [tipoDocuemento] = useBringDocument()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [open, setOpen] = useState(false)
    const [disableBoton, setDisableBoton] = useState(true)

    const reinicio = () => {
        setDataMascota([])
    }

    const handleModal = async () => {
        successMessage('')
        errorMessage('')
        const { todosDatos, validacion } = await getDataById({ id, endpoind: 'desparasitacion', defaultValues })
        if (validacion) {
            if (todosDatos instanceof Error) {
                setError(todosDatos)
            } else {
                setDisableBoton(false)
                setValues(todosDatos)
            }
        }
        setOpen(true)
    }
    const handleClose = () => {
        reinicio()
        setValues(defaultValues)
        setError('')
        setSuccess('')
        setOpen(false)
    }

    const handleSubmitId = async (event) => {
        event.preventDefault()
        if(!disableBoton)
        {
          setSuccess('')
          setDisableBoton(true)
          setDataMascota([])
        } else {
            try {
                const validation = emptyValidation({ DocumentType: values.tipoDocumento, DocumentNumber: values.numeroDocumento })
                setSuccess('')
                if (validation) {
                    setError('Por favor, complete los campos nesesarios.');
                    reinicio()
                }
                else {
                    setError('')
                    const getPets = await getPetsWithOwner({ DocumentType: values.tipoDocumento, DocumentNumber: values.numeroDocumento })
                    if (getPets instanceof Error) throw new Error(getPets.response.data.message)
                    setDataMascota(getPets)
                    setDisableBoton(false)
                    setSuccess('Datos cargados exitosamente.')
                }
            } catch (error) {
                reinicio()
                setError(`${error}`)
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setDisableBoton(true)
        try {
            let endpoint = 'https://mcv-backend-deploy.vercel.app/desparasitacion';
            let httpMethod = 'post';
            let envio = {};
            if (id !== null && id) {
                const { fecha_aplicacion_desparacitacion: fechaAplicacionDesparacitacion,
                } = values;
                envio = {
                    fechaAplicacionDesparacitacion: dateFormater({ time: fechaAplicacionDesparacitacion, format: "YYYY-MM-DD" })


                };
                endpoint += `/actualizar_desparasitacion/${values.id}`;
                httpMethod = 'put';
            } else {
                const { idMascota, idTipoDesparacitacion, medicamento_aplicado, lote_desparacitacion, registro_ica, laboratorio_desparacitacion, anotacion_desparacitacion, fecha_aplicacion_desparacitacion, fecha_vencimiento_desparacitacion } = values
                envio = {
                    idMascota,
                    idTipoDesparacitacion,
                    medicamento_aplicado,
                    lote_desparacitacion,
                    registro_ica,
                    laboratorio_desparacitacion,
                    anotacion_desparacitacion,
                    fecha_aplicacion_desparacitacion: dateFormater({ time: fecha_aplicacion_desparacitacion, format: "YYYY-MM-DD" }),
                    fecha_vencimiento_desparacitacion: dateFormater({ time: fecha_vencimiento_desparacitacion, format: "YYYY-MM-DD" }),
                };
                endpoint += '/crear_desparasitacion';

            }
            const response = await axios[httpMethod](endpoint, envio);
            successMessage(response.data.message)
            actualizar(!dato);
            handleClose()
        } catch (error) {
            setError(`Error: ${error.response.data.message}`);
            setDisableBoton(false)
        }
    }

    return (
        <div>
            <Boton
                onClick={handleModal}
                bgColor={bgColor}
                icon={icon}
                tooltip={tooltip}
                desable={desabilitado}
            />
            <Modal
                open={open}
                onClose={handleClose}
            >
                <form onSubmit={handleSubmit} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] border border-solid border-black rounded-lg shadow p-4 bg-white' autoComplete='off' id='form' noValidate>
                    <h1 className='text-3xl text-center mb-2'>{label}</h1>
                    {error && (
                        <Message className='mb-2' severity="error" message={error}>

                        </Message>
                    )}
                    {success && (

                        <Message className='mb-2' severity="success" message={success}>

                        </Message>
                    )}
                    <Grid container spacing={2} columns={12}>
                        <Grid item xs={12} sm={6}>
                            {validarId ? (
                                <Input
                                    id='idDocumento'
                                    fullWidth
                                    label='Tipo de documento'
                                    name='tipoDocumento'
                                    value={values.id_tipo_documento}
                                    onChange={handleInputChange}
                                    disabled={validarId ? true : false}
                                    required
                                />
                            ) : (
                                <Selects
                                    id='idDocumento'
                                    label='Tipo de Documento'
                                    name='tipoDocumento'
                                    value={values.tipoDocumento}
                                    onChange={handleInputChange}
                                    items={tipoDocuemento}
                                    disabled={!disableBoton ? true : false}
                                    required
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Input
                                id='numeroDocumento'
                                fullWidth
                                label='N°documento'
                                name='numeroDocumento'
                                value={values.numero_documento_cliente}
                                onChange={handleInputChange}
                                disabled={!disableBoton ? true : false}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Boton
                                onClick={handleSubmitId}
                                bgColor={!disableBoton ?  'error': 'success'} 
                                icon={!disableBoton ? <DeleteIcon sx={{ fontSize: 40 }}/> : <PetsIcon sx={{ fontSize: 40 }}/>}
                                tooltip='Buscar'
                                desable={validarId ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {validarId ? (
                                <Input
                                    id='idMascota'
                                    fullWidth
                                    label='Nombre Mascota'
                                    name='idMascota'
                                    value={values.nombre_mascota}
                                    onChange={handleInputChange}
                                    disabled={true}
                                    required
                                />
                            ) : (
                                <Selects
                                    id='idMascota'
                                    label='Nombre Mascota'
                                    name='idMascota'
                                    value={values.idMascota}
                                    onChange={handleInputChange}
                                    items={dataMascota}
                                    disabled={(validarId || dataMascota.length === 0) ? true : false}
                                    required
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {validarId ? (
                                <Input
                                    id='idTipoDesparacitacion'
                                    fullWidth
                                    label='Tipo de Desparacitación'
                                    name='idTipoDesparacitacion'
                                    value={values.tipo_desparacitacion}
                                    onChange={handleInputChange}
                                    disabled={true}
                                    required
                                />
                            ) : (
                                <Selects
                                    id='idTipoDesparacitacion'
                                    label='Desparacitacion'
                                    name='idTipoDesparacitacion'
                                    value={values.idTipoDesparacitacion}
                                    onChange={handleInputChange}
                                    items={despaTypes}
                                    disabled={(validarId || dataMascota.length === 0) ? true : false}
                                    required
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputDate
                                id='fecha_aplicacion_desparacitacion'
                                fullWidth
                                label='Fecha de Aplicación'
                                name='fecha_aplicacion_desparacitacion'
                                fecha={dayjs(values.fecha_aplicacion_desparacitacion).format("YYYY-MM-DD")}
                                onChange={handleInputChangeDate}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputDate
                                id='fecha_vencimiento_desparacitacion'
                                fullWidth
                                label='Fecha de Vencimiento'
                                name='fecha_vencimiento_desparacitacion'
                                fecha={values.fecha_vencimiento_desparacitacion}
                                onChange={handleInputChangeDate}
                                disabled={validarId ? true : false}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Input
                                id='medicamento_aplicado'
                                fullWidth
                                label='Medicamento Aplicado'
                                name='medicamento_aplicado'
                                value={values.medicamento_aplicado}
                                onChange={handleInputChange}
                                disabled={validarId ? true : false}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Input
                                id='lote_desparacitacion'
                                fullWidth
                                label='Lote de Desparacitación'
                                name='lote_desparacitacion'
                                value={values.lote_desparacitacion}
                                onChange={handleInputChange}
                                disabled={validarId ? true : false}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Input
                                id='registro_ica'
                                fullWidth
                                label='Registro ICA'
                                name='registro_ica'
                                value={values.registro_ica}
                                onChange={handleInputChange}
                                disabled={validarId ? true : false}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Input
                                id='laboratorio_desparacitacion'
                                fullWidth
                                label='Laboratorio de Desparacitación'
                                name='laboratorio_desparacitacion'
                                value={values.laboratorio_desparacitacion}
                                onChange={handleInputChange}
                                disabled={validarId ? true : false}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <button
                                type='submit'
                                className='w-full inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-500 to-violet-500 leading-normal text-xs ease-in tracking-tight-rem shadow-xs bg-150 bg-x-25 hover:-translate-y-px active:opacity-85 hover:shadow-md'
                                disabled={disableBoton}
                            >
                                Registrar
                            </button>
                        </Grid>

                    </Grid>
                </form>
            </Modal>
        </div>
    )
}

