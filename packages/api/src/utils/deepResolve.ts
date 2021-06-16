const isPromise = (value: any) => "then" in value;

async function resolveArray<T>(array: T[]): Promise<T[]> {
  const promises: (any | Promise<any> | Promise<any[]>)[] = [];
  for (let idx = 0, len = array.length; idx < len; idx++) {
    const element = array[idx];
    if (!element) {
      promises.push(element);
    } else if (Array.isArray(element)) {
      promises.push(resolveArray(element));
    } else if (typeof element !== "object") {
      promises.push(element);
    } else if (isPromise(element)) {
      promises.push(await resolve(await element));
    } else if (typeof element === "object") {
      promises.push(element);
    }
  }
  return await Promise.all(promises);
}

async function resolveObject(
  element: Record<string, any>
): Promise<typeof element> {
  const result: typeof element = {};
  const keys = Object.keys(element);
  for (let idx = 0, len = keys.length; idx < len; idx++) {
    const key: keyof typeof element = keys[idx];
    const value = element[key];
    if (!value) {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = await resolveArray(value);
    } else if (typeof value !== "object") {
      result[key] = value;
    } else if (isPromise(value)) {
      result[key] = await resolve(await value);
    } else {
      result[key] = await resolveObject(value);
    }
  }
  return result;
}

async function resolve<T>(element: T) {
  if (!element) {
    return element;
  } else if (Array.isArray(element)) {
    return resolveArray(element);
  } else if (typeof element === "object") {
    return resolveObject(element) as Promise<T>;
  } else {
    return element as T;
  }
}

export const deepResolve = resolve;
