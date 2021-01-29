import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { verify } from 'jsonwebtoken';
import { createLogger } from '../../utils/logger';
import { getToken } from '../../auth/utils';
const logger = createLogger('auth');
const auth0SecretId = process.env.AUTH0_SECRET_ID;
const auth0SecretField = process.env.AUTH0_SECRET_FIELD;
const secretsManager = new AWS.SecretsManager();
let clientSecret = 'QWrtRmGpVjtCCeQts6LdWzAFoU5-ov2maBD_tvAp0cFMysXjOmKz4K2AAjz3mKDj'; // tmp for the sake of not calling rmeote ssm
export const handler = async (event) => {
    try {
        const jwtToken = await verifyToken(event.authorizationToken);
        logger.info('User was authorized', jwtToken);
        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        };
    }
    catch (e) {
        logger.error('User not authorized', { error: e.message });
        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        };
    }
};
async function verifyToken(authHeader) {
    const token = getToken(authHeader);
    return verify(token, clientSecret);
}
// Opted for now
async function getSecret() {
    const data = await secretsManager.getSecretValue({ SecretId: auth0SecretId }).promise();
    return JSON.parse(data.SecretString);
}
//# sourceMappingURL=auth0Authorizer.js.map