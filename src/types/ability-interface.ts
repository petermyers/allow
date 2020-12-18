import { PERMISSIONS } from "./permissions";

export type EntityLevelFunction<U, T> = (user: U, entity: T) => boolean;
export type ClassLevelFunction<U> = (user: U) => boolean;

export type PermissioningFunction<U> =
  <T>(action: PERMISSIONS | string, entity: (new (...args: any[]) => T) | string, criteria: EntityLevelFunction<U, T> | ClassLevelFunction<U>) => void;

export type AbilityInterface<U> = {
  allow: PermissioningFunction<U>;
  disallow: PermissioningFunction<U>;
};