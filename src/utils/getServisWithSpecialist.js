import axios from "axios";

export const getServisWithSpecialist = async ({specialist}) => {
 const SPECIALIST_LIST = {
  4:'VET',
  5:'GRO'
 }

  try{
    const resultSer = await axios.get(`http://mcvapi.azurewebsites.net/servicios/${SPECIALIST_LIST[specialist]}`)
    return resultSer.data

  }catch(err){
    return err
  }
  
};
