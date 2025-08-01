import bcrypt from 'bcrypt';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';

export const loginUser = async(payload)=> {
  const {email,password} = payload;
  const adminsCollection = await dbConnect(collectionNamesObj.adminsCollection);
  const admin = await adminsCollection.findOne({email})
  if(!admin) return null;
  const isPasswordOK = bcrypt.compare(admin.password, password);
  if(!isPasswordOK) return null;

  return admin;
}
