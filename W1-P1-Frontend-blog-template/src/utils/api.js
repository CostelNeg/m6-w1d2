export const sendRequest = async (url, method, data = null ) =>{
    try{
        //recuperiamo il token dal localStorage
        const token = localStorage.getItem('token');
   

        //optioni della fetch

        const option = {
            method,
            headers : {'Content-Type':'application/json'}
        };
        //se  ce token lo aggiungiamo al bearer
        if(token){
            option.headers['Authorization'] = `Bearer ${token}`;
        }
        //se cis ono dati gli inviamo
        if(data){
            console.log('Trasimisione data', data)
            option.body =JSON.stringify(data)
        }
        const res = await fetch(url,option);

        if(!res.ok){throw new Error(`http error : ${res.status}`)}
        //senza errore return res
        return await res.json()
    }catch(err){
        console.error('Erorre durante la richiesta ')
        throw err
    }
}