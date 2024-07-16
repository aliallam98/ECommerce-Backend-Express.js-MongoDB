import mongoose from 'mongoose'
const connectToDB  = async ()=>{
    return await mongoose.connect(process.env.DB_ATLAS)
    .then(res=>console.log(`DB Connected successfully on .........`))
    .catch(err=>console.log(` Fail to connect  DB.........${err} `))
}

mongoose.set('strictQuery', true);

export default connectToDB;