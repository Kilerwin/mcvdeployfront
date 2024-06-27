import axios from "axios"
import { useEffect, useState } from "react"

const result = async () => {
    try {
      const res = await axios.get('https://mcv-backend-deploy.vercel.app/documentos')
      return res.data
    } catch (error) {
       return([])
    }
  }


  export const useBringDocument = ()=>{
    const [tipoDocuemento, setTipodocumento] = useState()
    const documentsSet = ()=>{
      result().then(doc => setTipodocumento(doc))
    }
    useEffect(documentsSet,[])
    return [tipoDocuemento]
  };