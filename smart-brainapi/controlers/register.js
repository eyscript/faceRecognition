const handleRegister=(req,res,bcrypt, bd)=>{
   
    const {email, password}=req.body;
    if(!email||!password){
        console.log(email,name,password)
       return res.status(400).json("incorrect form submission");
    }
    const hash=bcrypt.hashSync(password);
    bd.transaction(trx=>{
        trx.insert({
                    
            hash:hash,
            email:email
           

        }).into('login')
        .returning('email')
        .then(loginEmail=>{
            return trx('users')
            .returning('*')
            .insert({
                email:loginEmail[0],
                name:name,
                joined:new Date()
            })
            .then(user=>{
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch((err)=>res.status(400).json(err))
}
module.exports={
    handleRegister:handleRegister
}