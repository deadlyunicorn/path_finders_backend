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


test( 'Non caching results.', async()=>{

  const response1 = await generationRequest();
  const response2 = await generationRequest();

  expect( response1.data?.userId ).not.toBe( response2.data?.userId );

} );