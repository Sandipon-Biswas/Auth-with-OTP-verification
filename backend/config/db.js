import mongoose from "mongoose";
const {connect} = mongoose;

 const connectToMongo = async ()=>{
    try {
    await connect(process.env.MONGO_URI);
    console.log("databse connected")
} catch (error) {
    console.log(error)
}
}
export default connectToMongo;
//mongodb+srv://itv:itv@cluster0.pxdacb6.mongodb.net/
