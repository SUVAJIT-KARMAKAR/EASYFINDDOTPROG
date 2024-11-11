export const response = ( response, message, status, data, error ) => {
    response.status(status).json({
        message, 
        error : error || "None",
        data : data || "None"
    });
};