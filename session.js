const mongoose = require('mongoose');
const { Schema,model } = mongoose;
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const sessionSchema = new Schema({}, { strict: false });
const session = model('Session', sessionSchema);

async function deleteAllSessions() {
  try {
    mongoose.connect(uri).then(()=>{
      console.log('connected to mongodb')
    })
    .catch((error)=>{
      console.log('an error occured') 
    })
    const result = await session.deleteMany({});
    console.log(`Deleted ${result.deletedCount} session(s)`);
  } catch (error) {
    console.error("Error deleting sessions:", error);
  } finally {
    await mongoose.disconnect();
  }
}

deleteAllSessions();
