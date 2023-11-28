import { client } from "@/app/db/connection";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export const GET = async ( ) => {

  try{

    const accounts = client.db('path_finders').collection('accounts');
    const userLocations = client.db('path_finders').collection('userLocations');


    const possibleIds = Array.from({ length: 999_999 - 100_000 }, ( _, index )=> 100_000 + index + 1 );
    const nonAvailableIds : Array<number> = [];
    
    const accountsCursor = accounts.find({});

    for await ( const account of accountsCursor ){
      if ( account["userId"] ){
        nonAvailableIds.push( parseInt(account.userId) );
      }
    }


    const availableIds = possibleIds.filter( userId => !nonAvailableIds.includes(userId) );


    if ( availableIds.length < 500 ){
      //average database cleanup 
      //for the longterm

      //has not been tested
      //I hope it works lol.

      //updated has been tested
      //and has been confirmed that *it seems* it works 
      try{

        const usersToDelete = [];

        const userLocationsSorted = await userLocations.aggregate([
          {
            $sort: {
              updatedAt: 1
            }
          }
        ]).toArray();
        
        //get all the users that have had successfully used a userId.
        const userIdsThatHaveSharedTheirLocation = userLocationsSorted.map( document => document["userId"] );

        //get the ones that haven't ever shared their location - userId hash generation/storage failed.
        usersToDelete.push ( 
          ...nonAvailableIds
            .filter( id => !userIdsThatHaveSharedTheirLocation.includes( id ) ) );

        //get the 70% of the oldest ones..
        usersToDelete.push( ...userLocationsSorted
          .slice( 0, Math.floor( userLocationsSorted.length * 0.7 ) )
          .map( document => document["userId"] ) 
        );

        await accounts.deleteMany({
          "userId": {
            $in: usersToDelete
          }
        });

        await userLocations.deleteMany({
          "userId": {
            $in: usersToDelete
          }
        });

      }
      catch( error ){
        console.log( error );
      }

    }
 



    const randomId = availableIds[Math.floor( Math.random() * availableIds.length)];

    return NextResponse.json({
      data:{
        userId: randomId
      }
    });
    
  }

  catch( _ ){
    return NextResponse.json({
      error:{
        message: "Uknown Error."
      }
    });
  }
  


}