import axios from "axios"

export const APICALL = async(method,url,data,dataType)=>{
    try {
        if(method === "post"){
           if(dataType === "formdata"){
                const res = await axios.post(`${url}`,data,{withCredentials:true})
                return res
            }else{
            const res = await axios.post(`${url}`,{...data},{withCredentials:true})
            return res
        }
        }
        if(method === "put"){
            if(dataType === "formdata"){
                 const res = await axios.put(`${url}`,data,{withCredentials:true})
                 return res
             }else{
             const res = await axios.put(`${url}`,{...data},{withCredentials:true})
             return res
         }
         }
    } catch (error) {
        return error
    }
          
} 