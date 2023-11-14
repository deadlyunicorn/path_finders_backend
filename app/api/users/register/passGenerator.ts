import * as bcrypt from 'bcrypt';

export const getHashAndPassword = async() => {

  const randomValues = new Uint8Array(32);
  crypto.getRandomValues( randomValues );

  try{
    const randomHash = await crypto.subtle.digest('SHA-256', randomValues)
    .then((hashBuffer) => {
      let hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    });

    const pass = await bcrypt.hash( randomHash, 10 );

    return {
      data: {
        hash: randomHash,
        pass: pass
      }
    }

  }
  catch( err ){
    console.error( "Error inside passGenerator.ts" );
    return {
      error:{
        message: "Uknown Error."
      }
    }
  }
  


}

