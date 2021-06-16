import App from "src/app";

export type CronJobTickFunction = <T>(app: App) => Promise<T>;

abstract class CronJob<TickReturnValue = any> {
  /**
   * Job name.
   */
  name: string;
  app: App;
  abstract tick(): Promise<TickReturnValue>;
}

export default CronJob;
