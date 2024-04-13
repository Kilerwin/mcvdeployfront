import { Modal } from '@mui/material'
import { useState } from 'react'
import Boton from '../dash/boton'
import DataTable from '../../components/dash/dataTable'
import useSelectId from '../../Hooks/useSelectId';
import Botonera from '../../components/dash/botonera'
import axios from 'axios';
import AlertPrincipal from '../../components/dash/alertPrincipal';



const columns = [

    { field: 'fecha_creacion', headerName: 'Fecha de historial', width: 150, valueGetter: (params) => new Date(params.row.fecha_creacion).toLocaleDateString('es-ES') },
    { field: 'descripcion_servicio', headerName: 'Servicios prestados', width: 250 },
    { field: 'registro_historia_clinica_finalizado', headerName: 'Servicio finalizado', width: 150, valueGetter: (params) => params.row.registro_historia_clinica_finalizado === 1 ? 'Servicio Finalizado' : 'Servicio en proceso' },

]

export default function MascotaPerfil(props) {
    const { bgColor, icon, tooltip, id, name } = props
    const [open, setOpen] = useState(false)
    const { saveSelectId } = useSelectId()
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState('')

    const handleModal = async () => {
        try {
            setSuccess('')
            setError('')
            const result = await axios.get(`http://mcvapi.azurewebsites.net/info_mascotas/historial/${id}`)
            setData(result.data[0])
        } catch (error) {
            setData([])
            setError(error.response.data)
        }
        setOpen(true)

    }

    console.log(name)

    const handleClose = () => {
        saveSelectId('')
        setOpen(false)
    }

    return (
        <div>
            <Boton
                onClick={handleModal}
                bgColor={bgColor}
                icon={icon}
                tooltip={tooltip}
            />

            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className='min-h-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-solid border-black rounded-lg shadow p-4 bg-white'>
                    <Botonera
                        title={`Historial de la mascota ${name}`}

                    />
                    <DataTable rows={data} columns={columns} selectId={saveSelectId} />
                    <AlertPrincipal severity='error' message={error} />
                    <AlertPrincipal severity='success' message={success} />
                </div>
            </Modal>

        </div>
    );
}
