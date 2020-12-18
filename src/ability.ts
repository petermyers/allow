import { PERMISSIONS } from "./types/permissions";
import { PermissioningFunction, UserAbilityInterface } from "./types/user-ability-interface";
import { NotAuthorizedError } from './errors/not-authorized-error';

export default class UserAbility<U> {
  abilities: any = {};

  constructor(loader: (abilityInterface: UserAbilityInterface<U>) => void) {
      loader(this.interface());
  };

  private allow: PermissioningFunction<U> = <T>(action: PERMISSIONS | string, entity: (new () => T) | string, criteria: (user: U, entity: T) => boolean) => {
      const actions = action === PERMISSIONS.CRUD ? [
          PERMISSIONS.CREATE, PERMISSIONS.READ, PERMISSIONS.UPDATE, PERMISSIONS.DELETE
      ] : [action];

      const type = (typeof entity) === 'string' ? entity : (<any>entity).name;

      actions.forEach((act: PERMISSIONS | string) => {
          this.abilities[type] = this.abilities[type] || {};
          this.abilities[type][act] = this.abilities[type][act] || [];
          this.abilities[type][act].push(new Permission(act, criteria, true));
      });
  };

  private disallow: PermissioningFunction<U> = <T>(action: PERMISSIONS | string, entity: (new () => T) | string, criteria: (user: U, entity: T) => boolean) => {
      const actions = action === PERMISSIONS.CRUD ? [
          PERMISSIONS.CREATE, PERMISSIONS.READ, PERMISSIONS.UPDATE, PERMISSIONS.DELETE
      ] : [action];

      const type = (typeof entity) === 'string' ? entity : (<any>entity).name;

      actions.forEach((act: PERMISSIONS | string) => {
          this.abilities[type] = this.abilities[type] || {};
          this.abilities[type][act] = this.abilities[type][act] || [];
          this.abilities[type][act].push(new Permission(act, criteria, false));
      });
  };

  interface = (): UserAbilityInterface<U> => {
      return { allow: this.allow, disallow: this.disallow };
  };

  private checkPermission = <T>(action: PERMISSIONS | string, user: U, entity: T, type?: string) => {
      const isClassType = (<any>entity).constructor.name === 'Function';
      const derivedType = type || (isClassType ? (<any>entity).name : (<any>entity).constructor.name);

      const permissionChain = this.abilities[derivedType][action] || [];
      if (permissionChain.length === 0) return false;

      return permissionChain.reduce((result: boolean, permission: Permission<U, T>) => {
          return result && permission.evaluate(user, entity, isClassType);
      }, true);
  }

  permits = (user: U) => {
      return {
          toPerform: (action: PERMISSIONS | string) => {
              return {
                  on: <T>(entity: (new () => T) | T, type?: string) => {
                      return this.checkPermission(action, user, entity, type);
                  }
              };
          }
      };
  };

  ensure = (user: U) => {
      return {
          canPerform: (action: PERMISSIONS | string) => {
              return {
                  on: <T>(entity: (new () => T) | T, type?: string) => {
                      if (!this.checkPermission(action, user, entity, type)) throw new NotAuthorizedError('Not authorized to perform this action.');
                  }
              };
          }
      };
  }
}

class Permission<U, T> {
  permission: PERMISSIONS | string;
  criteria: (user: U, entity: T) => boolean;
  affirmative: boolean;

  constructor(permission: PERMISSIONS | string, criteria: (user: U, entity: T) => boolean, affirmative: boolean) {
      this.permission = permission;
      this.criteria = criteria;
      this.affirmative = affirmative;
  }

  evaluate = (user: U, entity: T, isClassType: boolean) => {
      if (isClassType) {
          return this.affirmative;
      } else {
          return this.criteria(user, entity) ? this.affirmative : !this.affirmative;
      }
  }
}