import mongoose from "mongoose";
export const handle_database_connection = async () => {
    try {
        const connection_instance = await mongoose.connect(
            `${process.env.MONGODB_URI}`
        );
        console.log(`DATABASE CONNECTED SUCCESSFULLY AT HOST ${connection_instance.connection.host}`)
    } catch ( error ) {
        console.log(`DATABASE CONNECTION FAILED DUE TO ${error}!`);
        throw error;
    }
};