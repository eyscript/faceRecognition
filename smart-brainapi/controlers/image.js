const Clarifai=require('clarifai');


const app =new Clarifai.App({
	apiKey:'06870a3d070e462c9432c5dd88a87ef2',
});

const handleAPI=(req,res)=>{
    console.log("req-body-input",req.body.input)
     app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
       .then(data=>{
     
       res.json(data);
     })
       .catch((error)=>res.status(400).json("unable to work with API"))
}


const handleImage=(req, res, bd)=>{

    const {id}=req.body;
    bd('users')
    .where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then((entries)=>res.json(entries[0]))
    .catch((error)=>res.status(400).json("unable to get entries"))

}
module.exports={

    handleImage,
    handleAPI
}
