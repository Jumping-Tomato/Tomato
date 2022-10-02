import { passwordResetRepo } from 'database/password-reset-repo'


/*
*
* This page is for un-authenticated users who forgot their password
* to reset their password.
*
*/
export default function tempPassowordResetPage({props}){
  

  return <p>Post: {props.tempPasswordResetId}</p>
}


export async function getServerSideProps(context) {
  const { tempPasswordResetId } = context.query;
  let passwordResetData;
  try{
    passwordResetData = await passwordResetRepo.find(tempPasswordResetId);
  }
  catch(error){
    console.error(error);
    throw error;
  }
  if(!passwordResetData || new Date() > new Date(passwordResetData.expire)){
    return {
      notFound: true,
    }
  }
  const props = {
    tempPasswordResetId: tempPasswordResetId
  };
  return {
    props: {props}
  }
}