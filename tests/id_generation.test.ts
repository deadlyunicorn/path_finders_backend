const generationRequest = async() =>{

  return await fetch( 'http://localhost:3000/api/users/generateId', {
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