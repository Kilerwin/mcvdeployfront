import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebarComponent'
import Botonera from '../../components/dash/botonera'
import { PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import DataTable from '../../components/dash/dataTable'
import useSelectId from '../../Hooks/useSelectId'
import { Stack } from '@mui/material'
import axios from 'axios'
import AlertEliminar from '../../components/dash/alertEliminar'
import { FromAgregarDesparacitacion } from '../../components/veterinario/agregarDesparacitacion'
import AlertPrincipal from '../../components/dash/alertPrincipal';

const columns = [
    { field: 'nombre_mascota', headerName: 'Nombre Mascota', width: 150 },
    {
        field: 'nombreDueño', headerName: 'Nombre Dueño', width: 160,
        valueGetter: (params) =>
            `${params.row.primer_nombre_cliente || ''} ${params.row.primer_apellido_cliente || ''}`
    },
    { field: 'numero_documento_cliente', headerName: 'Documento Del Dueño', width: 180 },
    {
        field: 'tipoDesparacitacion', headerName: 'Tipo Desparacitacion', width: 160,
        valueGetter: (params) =>
            `${params.row.id_tipo_desparacitacion === 'INT' ? 'Interna':'Externa'} `
    },
    { field: 'medicamento_aplicado', headerName: 'Medicamento Aplicado', width: 200 },
    { field: 'fecha_aplicacion_desparacitacion', headerName: 'Fecha de Aplicacion', width: 200, valueGetter: (params) => new Date(params.row.fecha_aplicacion_desparacitacion).toLocaleDateString('es-ES') },
];

export default function Desparacitacion() {
    const { selectId, saveSelectId } = useSelectId()
    const [rows, setRows] = useState([])
    const [error, setError] = useState(null)
    const [actualizar, setActualizar] = useState(false)
    const [success,setSuccess] = useState('')

    useEffect(() => {
        const fectchData = async () => {
            try {
                const result = await axios.get('https://mcvapi.azurewebsites.net/desparasitacion')
                setRows(result.data)
            } catch (error) {
                setRows([])
                setError('Error' + error.message)
            }
        }
        fectchData()
    }, [actualizar])
    return (
        <div className='flex gap-3'>
            <Sidebar />
            <Stack
                spacing={2}
                sx={{
                    position: 'fixed',
                    top: 10,
                    right: 6,
                    bottom: 5,
                    left: 'calc(22% + 3px)',
                    p: [2, 3, 4],
                    width: '77%',
                    display: 'flex',
                    overflow: 'auto'
                }}
            >
                <Botonera
                    title='Desparacitacion'
                    agregar={<FromAgregarDesparacitacion
                        icon={<PlusIcon className='w-6 h-6' />}
                        tooltip='Agregar Desparacitacion'
                        bgColor='secondary'
                        label='Agregar Desparacitacion'
                        actualizar={setActualizar}
                        dato={actualizar}
                        id={null} 
                        successMessage={setSuccess}
                        errorMessage={setError}/>

                    }
                    editar={
                        <FromAgregarDesparacitacion
                            icon={<PencilSquareIcon className='w-6 h-6' />}
                            tooltip='Actualizar Desparacitacion'
                            bgColor='primary'
                            label='Actualizar Desparacitacion'
                            actualizar={setActualizar}
                            dato={actualizar}
                            id={selectId} 
                            successMessage={setSuccess}
                            errorMessage={setError}/>

                    }

                    eliminar={<AlertEliminar
                        idSeleccionado={selectId}
                        tooltip='Desactivar Desparacitacion'
                        titulo='¿Desea desactivar el examen seleccionada?'
                        endPoint='desparasitacion/delete'
                        menssage='Por favor especifique el motivo por el cual desea desactivar la desparacitacion. Tenga en cuenta que este cambio es irreversible.'
                        actualizar={setActualizar}
                        dato={actualizar} />}
                />
                <DataTable rows={rows} columns={columns} selectId={saveSelectId} />
            </Stack>
            <AlertPrincipal severity='error' message={error}/>
            <AlertPrincipal severity='success' message={success}/>
        </div>
    )
}


