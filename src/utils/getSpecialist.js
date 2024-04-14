import axios from "axios";

export const getSpecialist = async ({specialist}) => {
  try{
    const result = await axios.get(`https://mcvapi.azurewebsites.net/especialistas/${specialist}`)
    return result.data
  }catch(err){
    return err
  }
};
