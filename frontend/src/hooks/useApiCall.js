import axios from "axios"

export const APICALL = async(method,url,data)=>{
    try {
        if(method === "post"){
            const res = await axios.post(`${url}`,{...data},{withCredentials:true})
            return res
        }
    } catch (error) {
        return error
    }
          
} 