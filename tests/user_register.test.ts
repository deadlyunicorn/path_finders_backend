import { ErrorMessages } from "../app/types";

export const registerAttempt = async ( userIdValue: any ) => await fetch('http://localhost:3000/api/users/register',{
    method:"POST",
    headers:[
      ["Content-type","application/json"]
    ],
    body:JSON.stringify({
      "userId": userIdValue
    })
  }).then( async ( res ) => res.ok? res.json() :null);

test( 'Attempt to register with userId < 100_000', async()=>{
  
  const result = await registerAttempt( 99 );

  expect( result ).toEqual( { error: { message : "Invalid Id Value." } })

} );

test( 'Attempt to register with userId > 999_999', async()=>{
  
  const result = await registerAttempt( 1_999_999 );

  expect( result ).toEqual( { error: { message : "Invalid Id Value." } })

} );

test( 'Attempt to register with userId NaN', async()=>{
  
  const result = await registerAttempt( "Lorem Ipsum." );

  expect( result ).toEqual( { error: { message : "Invalid Id Value." } })

} );

test( 'Attempt to register with userId undefined', async()=>{
  
  const result = await registerAttempt( undefined );

  expect( result ).toEqual( { error: { message : ErrorMessages.InvalidRequest } })

} );

test( 'Attempt to register with userId null', async()=>{
  
  const result = await registerAttempt( null );

  expect( result ).toEqual( { error: { message : ErrorMessages.InvalidRequest } })

} );