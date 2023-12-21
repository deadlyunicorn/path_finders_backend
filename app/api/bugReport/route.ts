import sgMail from '@sendgrid/mail'
import { NextRequest, NextResponse } from 'next/server';

const key = process.env.SENDGRID_KEY ; 

export const POST = async( req: NextRequest ) => {

    const body = await req.json();

    if ( 
        body != null &&
        key != null &&
        body["bugSummary"] != null &&
        body["bugDescription"] !=null   
    ){
        sgMail.setApiKey( key )
        const msg = {
        to: 'retroalex1008@gmail.com', // Change to your recipient
        from: 'notification.deadlyunicorn@gmail.com', // Change to your verified sender
        subject: 'Path Finders Bug Report - ' + body["bugSummary"],
        text: body["bugDescription"],
        }
        const messageSent = await sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
                return NextResponse.json({
                    "sent": true
                })
            })
            .catch((error : any) => {
                console.error(error)
            })
        
        if ( messageSent ) return messageSent;

        
    }
    else{
        console.error( "No environment variable" );
    }

    return NextResponse.json({
        "sent": false
    })



}