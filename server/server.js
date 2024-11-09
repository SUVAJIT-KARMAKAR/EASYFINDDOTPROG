import dotenv from "dotenv";
import { application } from "./application.js";
import { handle_database_connection } from "./database/Connection.js";
import { database_retires } from "./constants.js";

dotenv.config();

// IIFE
await ( async() => {
    let retires = database_retires;
    while ( retires -- ) {
        try {
            console.log(`TRYING TO CONNECT TO THE DATABASE !`);
            await handle_database_connection();
            break;
        } catch ( error ) {
            if ( !retires ) {
                process.exit(1);
            }
            await new Promise( (resolve) => setTimeout(resolve, 1000));
        }   
    }
})();

// Listen 
const PORT = process.env.PORT || 5050;
application.listen(PORT, (error) => {
    if ( error ) {
        console.log(`ERROR CONNECTING TO THE POST AT ${error}`);
    } else {
        console.log(`SERVER IS RUNNING AT PORT ${PORT}`);
    }
});