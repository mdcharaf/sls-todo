import 'source-map-support/register'
import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import * as AWS from 'aws-sdk';
import { verify , decode, JsonWebTokenError } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')
const auth0SecretId = process.env.AUTH0_SECRET_ID;
const auth0SecretField = process.env.AUTH0_SECRET_FIELD;
const secretsManager = new AWS.SecretsManager();
let cachedSecret: string;

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

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
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

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
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  if (!authHeader) {
    throw new Error('Invalid Auth Header');
  }
  if (!authHeader.toLocaleLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid AuthHeader Format');
  }

  const token = getToken(authHeader)
  const clientSecret = (await getSecret())[auth0SecretField];

  return verify(token, clientSecret) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function getSecret() {
  if (cachedSecret) 
    return cachedSecret;

  const data = await secretsManager.getSecretValue( { SecretId: auth0SecretId }).promise();
  cachedSecret = data.SecretString;

  return JSON.parse(cachedSecret);
}
