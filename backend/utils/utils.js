

export function parsePayload(payload = {}, requiredFields = []) {
    const parsed = {};
    
    // Parse all fields from payload
    for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'string') {
            parsed[key] = value.trim();
        } else {
            parsed[key] = value;
        }
    }
    
    // Check required fields
    for (const field of requiredFields) {
        if (parsed[field] === undefined || parsed[field] === null || 
            (typeof parsed[field] === 'string' && parsed[field].trim() === '')) {
            throw new Error(`${field} wajib diisi`);
        }
    }
    
    return parsed;
}
