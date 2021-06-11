export enum ExecutionResultEnum {
  Continue = "Continue",
  End = "End",
  Error = "Error",
}

/**
 * Returned by a subclass of AbstractNodeExecutor in the execute function to
 * let the CampaignNodeEvaluator whether to proceed with campaign execution.
 */
class ExecutionResult {
  result: ExecutionResultEnum;
  data?: Record<string, any>;
  constructor(result: ExecutionResultEnum, data?: Record<string, any>) {
    this.result = result;
    this.data = data;
  }
}

export default ExecutionResult;
