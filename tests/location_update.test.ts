import { ErrorMessages } from "../app/types";

const user100002hash = '20870ad42163bf95a9d5451ee6e3e1ca93f0b1f256cf7b2a9a4189fd7a01b423';

const updateLocation = async( testData: any ) => 
  await fetch('http://localhost:3000/api/users/update',{
    method:"PUT",
    headers:[
      ["Content-type","application/json"]
    ],
    body:JSON.stringify( testData )
  }).then( async ( res ) => res.ok? res.json() :null);


  test ( 'Remove location test', async() => {

    const response = await updateLocation({
      userId : 100_002,
      hash: user100002hash,
      stopSharing: "true"
    });
    expect( response ).toHaveProperty( "data.updatedAt" );
    expect( new Date( response["data"]["updatedAt"] ) ).toEqual( new Date( '1900' ) );
  
  } );


test( "Test last updated value", async()=> { //that's how the implementation should look like

  const response = await fetch( 'http://localhost:3000/api/users/100000' )
  .then( async ( res ) => res.ok? await res.json() :null );

  const updatedAt = response["data"]["updatedAt"];


  if ( new Date( updatedAt ).getTime() - new Date().getTime() < -1800000 ){
    expect( response ).toHaveProperty( "error.message" ); 
    expect( response["error"]["message"] ).toBe( 'User is not sharing their location right now.' )
  }
  else{
    expect( response ).toHaveProperty( "data.location.coordinates.latitude" ); 
  }
} )

test ( 'Test Location Change', async() => {

  await updateLocation({
    userId : 100_002,
    hash: user100002hash,
    location: {
      longitude: 42,
      latitude: 16
    }
  });


  const response = await fetch( 'http://localhost:3000/api/users/100002' )
  .then( async ( res ) => res.ok? await res.json() :null );

  
  expect( response ).toHaveProperty( "data.location.coordinates.longitude" );



  expect( response["data"]["location"]["coordinates"]["longitude"] ).toBe( 42 );

  await updateLocation({
    userId : 100_002,
    hash: user100002hash,
    location: {
      longitude: 20,
      latitude: 16
    }
  });

  const response2 = await fetch( 'http://localhost:3000/api/users/100002' )
  .then( async ( res ) => res.ok? await res.json() :null );
  expect( response2["data"]["location"]["coordinates"]["longitude"] ).toBe( 20 );


} );


test ( 'Successful update', async() => {

  const response = await updateLocation({
    userId : 100_002,
    hash: user100002hash,
    location: {
      longitude: 20,
      latitude: 20
    }
  });
  expect( response ).toHaveProperty( "data.updatedAt" );

} );


test ( "User not found", async() => {

  const response = await updateLocation({
    userId : 100_000,
    hash: 123,
    location: {
      longitude: 20,
      latitude: 20
    }
  });
  expect( response ).toEqual( { error: { message: "No account." }} );
});

test ( "Wrong hash", async() => {

  const response = await updateLocation({
    userId : 100_002,
    hash: 123,
    location: {
      longitude: 20,
      latitude: 20
    }
  });
  expect( response ).toEqual( { error: { message: "Invalid Request. Try erasing the app data." }} );
});

test ( "Invalid Locations", async() => {

  const response = await updateLocation({
    userId : 100_002,
    hash: 123,
    location: {
      longitude: "Very20",
      latitude: 20
    }
  });
  expect( response ).toEqual( { error: { message: "Invalid Location." }} );
});

test( "Undefined fields", async()=>{
  
  const noLocation = await updateLocation({
    userId: 100_002,
    hash: user100002hash,
    location : undefined
  });

  const noUserId = await updateLocation({
    userId: undefined,
    hash: user100002hash,
    location : {
      longitude: 120,
      latitude: 40
    }
  })

  const noHash = await updateLocation({
    userId: 100_002,
    hash: undefined,
    location : {
      longitude: 120,
      latitude: 40
    }
  })
  
  const emptyRequest = await updateLocation({});

  expect( noLocation ).toEqual( { error: { message: ErrorMessages.InvalidRequest } });
  expect( noUserId ).toEqual( { error: { message: ErrorMessages.InvalidRequest} });
  expect( noHash ).toEqual( { error: { message: ErrorMessages.InvalidRequest } });
  expect( emptyRequest ).toEqual( { error: { message: ErrorMessages.InvalidRequest } });

})