import type { PageContext } from "vike/types";

export function assertDataIsObject(
  data: unknown
): asserts data is Record<string, unknown> {
  if (!isPlainObject(data))
    throw new Error(
      "Return value of data() should be a plain object, undefined, or null"
    );
}

export function objectReplace(obj: object, objAddendum: object) {
  // @ts-ignore
  Object.keys(obj).forEach((key) => delete obj[key]);
  Object.assign(obj, objAddendum);
}

export function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum);
}

export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  // Is object?
  if (typeof value !== "object" || value === null) {
    return false;
  }

  // Support `Object.create(null)`
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }

  // Is plain object?
  return (
    /* Doesn't work in Cloudflare Pages workers
    value.constructor === Object
    */
    value.constructor.name === "Object"
  );
}

type Hook = (pageContext: PageContext) => unknown;
type PlainHook = unknown;

export function callCumulativeHooks<
  T extends Hook | PlainHook,
  C extends PageContext
>(hooks: T[] | undefined, pageContext: C) {
  return Promise.all(
    hooks?.map((hook) =>
      typeof hook === "function" ? hook(pageContext) : hook
    ) ?? []
  );
}