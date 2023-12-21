import { url } from "./url";

test( 'Attempt to submit a bug report', async()=>{
  
  const result = await fetch( `${url}/api/bugReport`,{
    method:"POST",
    headers:[
      ["Content-type","application/json"]
    ],
    body:JSON.stringify({
      "bugSummary": "hello world",
      "bugDescription": "It works!"
    })
  }).then( async ( res ) => res.ok? res.json() :null);

  expect( result ).toEqual( { "sent": true } )

} );