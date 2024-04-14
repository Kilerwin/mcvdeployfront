import axios from "axios";

export const emptyValidation = ({DocumentType, DocumentNumber}) =>{
  return DocumentType === '' || DocumentNumber === '' ? true : false
} 

export const getPetsWithOwner = async ({DocumentType, DocumentNumber}) => {
  try {
    const result = await axios.get(`https://mcvapi.azurewebsites.net/mascotas/${DocumentType}/${DocumentNumber}`)
    return result.data
  } catch (error) {
    return error
  }
}