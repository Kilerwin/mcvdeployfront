import axios from "axios"

export const getDataById = async ({id, endpoind, defaultValues}) => {
  if(id !== null && id){
    try {
        const result = await axios.get(`https://mcv-backend-deploy.vercel.app/${endpoind}/${id}`)
        const todosDatos = {
            ...defaultValues,
            ...result.data
        }
        return {todosDatos, validacion: (id !== null && id)}
    } catch (error) {
        return {todosDatos: `Error: ${error.response.data.message}`,validacion: (id !== null && id)}
    }
}else{
    return {todosDatos: null, validacion: (id!== null && id)}
}
}