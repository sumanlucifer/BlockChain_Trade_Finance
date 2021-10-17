const sapError = (error) => {
    console.log('errorerror ',error)
    try {
        error.message = error.message.split("400 - ")[1];
        // console.log('error.messageerror.messageerror.message ', );
        // console.log('error.messageerror.messageerror.message ', typeof error.message);

        var errorObject = typeof error.message === 'object' ? error.message : JSON.parse(error.message);
        // console.log('errorObject.value ', errorObject)
        console.log('errorObject.error.message ',errorObject.error.message)
        if (errorObject.error.message.value) {
            var errorMessage = errorObject.error.message.value;
            return {
                message: errorMessage
            }
        } else {
            return error;
        }
    } catch (e) {
        // console.log('errorerrorerror ',error.message)
        return {
            message: "Communication with SAP system failed. Please try again after a few minutes.",
        };
    }
}

exports.sapError = sapError