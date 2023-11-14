import { url } from "./url";

const generationRequest = async() =>{

  return await fetch( `${url}/api/users/generateId`, {
    headers:[
      ["Content-type","application/json"]
    ]
  })
  .then( async( res ) => res.ok? await res.json() : null );
}

test( 'Generate random id', async()=>{

  const response = await generationRequest();

  expect( response?.data?.userId ).toBeGreaterThan( 99_999 );

} );