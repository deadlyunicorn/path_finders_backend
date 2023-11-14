import { ObjectId } from "mongodb";
import { ErrorMessages } from "../../../types";
import { client } from "@/app/db/connection";
import { NextResponse } from "next/server";

export const GET = async( req: Request, { params }: { params: { userId: string }} ) => {

  const userId = params.userId;

  const userLocations = client.db('path_finders').collection('userLocations');

  try{
    const userIdValue = parseInt( userId );
    if ( Number.isNaN ( userIdValue ) ){
      throw ErrorMessages.InvalidRequest
    }
    const data = await userLocations  
    .findOne({
      userId: userIdValue
    }) as userResponse;

    if ( data ){

      const { _id, ...finalData } = data;

      if ( new Date( data.updatedAt ).getTime() - new Date().getTime() < -1800000 ){

        await userLocations.updateOne(
          { userId: userId },
          { $unset: { location: "" } }
        );

        const { location, ...dataWithNoLocation } = finalData; 

        return NextResponse.json( {
          data: dataWithNoLocation,
          error: {
            message: "User is not sharing their location right now."
          }
        } );
          
        
      }

      return NextResponse.json( { data: finalData } );
    }
    else{
      throw 'User not found';
    }

  }
  catch( err ){
    console.error( err );
    return NextResponse.json( {
      error:{
        message: err
      }
    } )
  } 
  
}

type usersParams = { 
  userId: string
}

type userResponse = {
  _id: ObjectId,
  userId: string,
  location:{
    longitude: number,
    latitude: number
  },
  updatedAt: number
}