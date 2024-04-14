import axios from "axios"
import { useEffect, useState } from "react"

const result = async () => {
    try {
      const res = await axios.get('https://mcvapi.azurewebsites.net/userTypes')
      return res.data
    } catch (error) {
       return  `Error: ${error.response.data.message}`
    }
  }


  export const useBringUserType = ()=>{
    const [positinItems, setPositinItems] = useState()  
    const documentsSet = ()=>{
      result().then(doc => setPositinItems(doc))
    }
    useEffect(documentsSet,[])
    return [positinItems]
  };