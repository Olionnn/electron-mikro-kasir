

function createSuccessResponse(message= '', data, pagination = null) {
    const response = {
        success: true,
        message: message || "Operation successful",
        data
    };

    if (pagination) {
        response.pagination = pagination;
    }

    return response;
}
  
function createErrorResponse(error, context = '') {
    console.error(`Error ${context}:`, error);
    return {
        success: false,
        error: error || 'An unexpected error occurred'
    };
}

export { createSuccessResponse, createErrorResponse };