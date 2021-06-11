interface Identifiable {
  id: string;
}

class QueryResult<T extends Identifiable> {
  operator: "and" | "or";
  executionPromise: Promise<T[]>;
  children: QueryResult<T>[] = [];
  result: T[];
  constructor(executionPromise?: Promise<T[]>) {
    this.executionPromise = executionPromise;
  }
  getIds() {
    return this.result.map((elem) => ({ id: elem.id, element: elem }));
  }
  async execute(): Promise<QueryResult<T>> {
    if (this.executionPromise) {
      this.result = await Promise.resolve(this.executionPromise);
      return this;
    }

    const promises: Promise<QueryResult<T>>[] = [];
    this.children.forEach((child) => {
      promises.push(child.execute());
    });
    const resultSet = await Promise.all(promises);
    if (this.operator === "and") {
      this.result = this.mergeAnd(resultSet);
    } else {
      this.result = this.mergeOr(resultSet);
    }

    return this;
  }
  mergeAnd(resultSet: QueryResult<T>[]) {
    const cache: Record<string, { count: number; elem: T }> = {};
    const merged: T[] = [];
    let firstIteration = true;

    resultSet.forEach((queryResult) => {
      const idSet = queryResult.getIds();
      if (firstIteration) {
        idSet.map((elem) => {
          cache[elem.id] = {
            count: 1,
            elem: elem.element,
          };
        });
        firstIteration = false;
      } else {
        idSet.map((elem) => {
          if (typeof cache[elem.id] !== "undefined") {
            cache[elem.id].count++;
          }
        });
      }
    });

    Object.keys(cache).forEach((key) => {
      if (cache[key].count === this.children.length) {
        merged.push(cache[key].elem);
      }
    });

    return merged;
  }
  mergeOr(resultSet: QueryResult<T>[]) {
    const cache: Record<string, T> = {};

    resultSet.forEach((queryResult) => {
      const idSet = queryResult.getIds();
      idSet.map((elem) => {
        if (typeof cache[elem.id] === "undefined") {
          cache[elem.id] = elem.element;
        }
      });
    });

    return Object.values(cache);
  }
}

export default QueryResult;
