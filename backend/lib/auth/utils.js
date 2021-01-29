import { decode } from 'jsonwebtoken';
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
    const decodedJwt = decode(jwtToken);
    return decodedJwt.sub;
}
export function getToken(authHeader) {
    if (!authHeader)
        throw new Error('No authentication header');
    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error(`Invalid authentication header format: ${authHeader}`);
    const split = authHeader.split(' ');
    const token = split[1];
    return token;
}
export function getUserIdFromToken(authHeader) {
    const token = getToken(authHeader);
    return parseUserId(token);
}
//# sourceMappingURL=utils.js.map