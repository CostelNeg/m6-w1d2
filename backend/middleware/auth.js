import jwt from 'jsonwebtoken';
 const authToken =(req,res, next) =>{
    //prendiamo il token dal header del Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader&&authHeader.split(' ')[1]// aggiunta al baerer token

    if(token===null)return res.sendStatus(401)//se non ce token errore

    jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
        //se toiken non ce restituisce errore 
        if(err) return res.sendStatus(403)
            req.user = user;
        next();
    });
};
 export default authToken