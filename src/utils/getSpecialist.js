import axios from "axios";

export const getSpecialist = async ({specialist}) => {
  try{
    const result = await axios.get(`https://mcv-backend-deploy.vercel.app/especialistas/${specialist}`)
    return result.data
  }catch(err){
    return err
  }
};
