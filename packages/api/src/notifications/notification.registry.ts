export interface Notification {
  userId: string;
}

export class NotificationStrategy {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  send(payload: Notification) {}
}

class AlertRegistry {
  alertStrategies: Record<string, NotificationStrategy>;
  constructor() {
    this.alertStrategies = {};
  }
  getRegisteredAlerts() {
    return this.alertStrategies;
  }
  registerNotification(alert: NotificationStrategy) {
    if (this.alertStrategies[alert.type]) {
      throw new Error(
        "This alert strategy has already been registered: " + alert.type
      );
    }
    this.alertStrategies[alert.type] = alert;
  }
  process(type: string, alert: any) {
    if (!this.alertStrategies[type]) {
      throw new Error("No alert strategy registered for type " + type);
    }
    const strategy = this.alertStrategies[type];
    strategy.send(alert);
  }
}

const alertRegistry = new AlertRegistry();

export default alertRegistry;
