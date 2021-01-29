import * as AWS from 'aws-sdk';
import { CloudWatch } from 'aws-sdk';

export interface ICloudWatchService {
  recordRequestsCount();
};

class CloudWatchService {
  constructor(private readonly cloudWatch: CloudWatch = new CloudWatch()) {}

  async recordRequestsCount() {
    await this.cloudWatch.putMetricData({
      MetricData: [
        {
          MetricName: 'RequestCount',
          Unit: 'Count',
          Value: 1
        }
      ],
      Namespace: 'Todo'
    }).promise();
  }
}

export function createCloudWatchService() { return new CloudWatchService() }