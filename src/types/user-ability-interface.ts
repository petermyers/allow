import { PERMISSIONS } from "./permissions";

export type PermissioningFunction<U> =
  <T>(action: PERMISSIONS | string, entity: (new () => T) | string, criteria: (user: U, entity: T) => boolean) => void;

export type UserAbilityInterface<U> = {
  allow: PermissioningFunction<U>;
  disallow: PermissioningFunction<U>;
};