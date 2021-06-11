class Middleware {
  middleware: any[];
  constructor() {
    this.middleware = [];
  }
  addMiddleware(middleware: any) {
    this.middleware.push(middleware);
  }
}

const instance = new Middleware();
export default instance;
