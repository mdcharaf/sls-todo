import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createCloudWatchService, ICloudWatchService } from "../../services/cloudwatchService";
import { createTodoService, ITodoService } from "../../services/TodoService";
import response from '../response'

const cloudWatchService: ICloudWatchService = createCloudWatchService();
const todoService: ITodoService = createTodoService();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);
  await cloudWatchService.recordRequestsCount();

  const todoId = event.pathParameters.todoId
  const bucketName = process.env.S3_BUCKET;
  const presignedUrl = todoService.createAttachementPresignedUrl(todoId, bucketName);

  return response.success({ uploadUrl: presignedUrl });
}
