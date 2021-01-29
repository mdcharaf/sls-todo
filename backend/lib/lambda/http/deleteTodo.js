import 'source-map-support/register';
import { getUserIdFromToken } from '../../auth/utils';
import * as AWS from 'aws-sdk';
import response from '../response';
const tableName = process.env.TODO_TABLE;
const dbClient = new AWS.DynamoDB.DocumentClient();
export const handler = async (event) => {
    const todoId = event.pathParameters.todoId;
    const token = event.headers.Authorization;
    const userId = getUserIdFromToken(token);
    await dbClient.delete({
        TableName: tableName,
        Key: {
            'todoId': todoId,
            'userId': userId
        }
    }).promise();
    return response.success();
};
//# sourceMappingURL=deleteTodo.js.map