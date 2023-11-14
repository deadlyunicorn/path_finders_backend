import { client } from "@/app/db/connection";
import { NextResponse } from "next/server";

export const GET = async ( ) => {

  try{

    const accounts = client.db('path_finders').collection('accounts');

    const possibleIds = Array.from({ length: 999_999 - 100_000 }, ( _, index )=> 100_000 + index + 1 );
    const nonAvailableIds : Array<number> = [];
    
    const accountsCursor = accounts.find({});

    for await ( const account of accountsCursor ){
      if ( account["userId"] ){
        nonAvailableIds.push( parseInt(account.userId) );
      }
    }


    const availableIds = possibleIds.filter( userId => !nonAvailableIds.includes(userId) );
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