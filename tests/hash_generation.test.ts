import { registerAttempt } from "./user_register.test";

test( 'Get a new hash for the user 100_000', async()=>{
 
  const result = await registerAttempt( 100_000 );

  expect( result ).toHaveProperty( "data.hash" );
  
} );

test( 'Get an error message for the existing user 100_001', async()=>{

  const result = await registerAttempt( 100_001 );

  expect( result ).toEqual( { error: { message : "Id Not Available." } });

  
} );