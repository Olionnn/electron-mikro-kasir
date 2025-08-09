

function createSuccessResponse(data, pagination = null) {
    const response = {
        success: true,
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
        error: error.message || 'An unexpected error occurred'
    };
}

export { createSuccessResponse, createErrorResponse };