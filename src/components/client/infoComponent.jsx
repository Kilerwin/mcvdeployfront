import React, { useEffect, useState } from 'react';
import { DashboardCard } from '../../components/dash/dashboardCart';
import axios from 'axios';

const defaultValues = {
    total_examenes_generados: 0,
    total_solicitudes_citas: 0,
    total_certificados_generados: 0,
    total_mascotas: 0
}

const Infocard = () => {
    const storedClient = localStorage.getItem('client');
    let parsedClient = null;

    try {
        parsedClient = storedClient ? JSON.parse(storedClient) : null;
    } catch (error) {
        console.error('Error al analizar el cliente desde el almacenamiento local:', error);
    }

    const [client] = useState(parsedClient);
    const [data, setData] = useState(defaultValues);
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        if (client && client.id) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`https://mcv-backend-deploy.vercel.app/home_perfil/${client.id}`);
                    if (response.data) {
                        setData(response.data);
                        setLastUpdateTime(new Date());
                    } else {
                        console.log('Cliente no encontrado');
                    }
                } catch (error) {
                    console.log(error);
                }
            };

            fetchData();

            const interval = setInterval(() => {
                fetchData();
            }, 15 * 60 * 1000);

            return () => clearInterval(interval);
        }
    }, [client]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const elapsedTime = Math.floor((now - lastUpdateTime) / 1000);
            setTimeElapsed(elapsedTime);
        }, 1000);

        return () => clearInterval(timer);
    }, [lastUpdateTime]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} m`;
    };

    const infoCard = [
        {
            titulo: "Examenes generado",
            Info: data.total_examenes_generados,
            estado: formatTime(timeElapsed),
            iconColor: "bg-gradient-from-blue-600-to-blue-400",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>

            ),
        },

        {
            titulo: "Total de mascotas",
            Info: data.total_mascotas,
            estado: formatTime(timeElapsed),
            iconColor: "bg-gradient-from-pink-600-to-pink-400",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>

            ),
        },
        {
            titulo: "Solicitud de citas",
            Info: data.total_solicitudes_citas,
            estado: formatTime(timeElapsed),
            iconColor: "bg-gradient-from-orange-600-to-orange-400",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                </svg>

            ),
        },
        {
            titulo: "Certificados generados",
            Info: data.total_certificados_generados,
            estado: formatTime(timeElapsed),
            iconColor: "bg-gradient-from-green-600-to-green-400",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>

            ),
        },


    ];
    return (
        <div className="mt-15">
            <h2 className="mb-5 mt-1 text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-700 text-white p-2 rounded-lg">
                Perfil principal
            </h2>
            <div className="mb-15 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">

                {infoCard.map((data, index) => (
                    <DashboardCard key={index} {...data} />
                ))}
            </div>
        </div>
    )
}


export default Infocard;