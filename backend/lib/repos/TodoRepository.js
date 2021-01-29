import * as AWS from 'aws-sdk';
export class TodoRepository {
    constructor() {
        this.tableName = process.env.TODO_TABLE;
        this.dbClient = new AWS.DynamoDB.DocumentClient();
        this.todoIndexName = process.env.TODO_INDEX;
    }
    async create(item) {
        await this.dbClient.put({
            TableName: this.tableName,
            Item: item
        }).promise();
        return item;
    }
    async update(item) {
        await this.dbClient.update({
            TableName: this.tableName,
            Key: {
                'todoId': item.todoId,
                'userId': item.userId
            },
            UpdateExpression: 'set #name=:n, #done=:d, #dueDate=:dt',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#done': 'done',
                '#dueDate': 'dueDate',
            },
            ExpressionAttributeValues: {
                ":n": item.name,
                ":d": item.done,
                ":dt": item.dueDate
            },
        }).promise();
        return item;
    }
    async delete(todoId, userId) {
        await this.dbClient.delete({
            TableName: this.tableName,
            Key: {
                'todoId': todoId,
                'userId': userId
            }
        }).promise();
        return true;
    }
    async getByUserId(userId) {
        const result = await this.dbClient.query({
            TableName: this.tableName,
            IndexName: this.todoIndexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();
        return result.Items;
    }
}
//# sourceMappingURL=TodoRepository.js.map