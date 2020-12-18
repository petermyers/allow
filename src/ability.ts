import { Permissions } from './types/permissions'
import {
    PermissioningFunction,
    AbilityInterface,
    EntityLevelFunction,
    ClassLevelFunction,
} from './types/ability-interface'
import { NotAuthorizedError } from './errors/not-authorized-error'

type AbilityPermissionKey = string | Permissions
export default class Ability<U> {
    abilities: {
        [key: string]: {
            [key in AbilityPermissionKey]: Permission<U, unknown>[]
        }
    } = {}
    // abilities: any = {}

    constructor(loader: (abilityInterface: AbilityInterface<U>) => void) {
        loader(this.interface())
    }

    private allow: PermissioningFunction<U> = <T>(
        action: Permissions | string,
        entity: (new (...args: unknown[]) => T) | string,
        criteria: EntityLevelFunction<U, T> | ClassLevelFunction<U>
    ) => {
        const actions =
            action === Permissions.CRUD
                ? [
                      Permissions.CREATE,
                      Permissions.READ,
                      Permissions.UPDATE,
                      Permissions.DELETE,
                  ]
                : [action]

        const type =
            typeof entity === 'string'
                ? <string>entity
                : (<new (...args: unknown[]) => T>entity).name

        actions.forEach((act: Permissions | string) => {
            this.abilities[type] =
                this.abilities[type] ||
                <{ [key in AbilityPermissionKey]: Permission<U, unknown>[] }>{}
            this.abilities[type][act] = this.abilities[type][act] || []
            this.abilities[type][act].push(
                new Permission(act, criteria, PermissionType.ALLOW)
            )
        })
    }

    private disallow: PermissioningFunction<U> = <T>(
        action: Permissions | string,
        entity: (new (...args: unknown[]) => T) | string,
        criteria: EntityLevelFunction<U, T> | ClassLevelFunction<U>
    ) => {
        const actions =
            action === Permissions.CRUD
                ? [
                      Permissions.CREATE,
                      Permissions.READ,
                      Permissions.UPDATE,
                      Permissions.DELETE,
                  ]
                : [action]

        const type =
            typeof entity === 'string'
                ? <string>entity
                : (<new (...args: unknown[]) => T>entity).name

        actions.forEach((act: Permissions | string) => {
            this.abilities[type] =
                this.abilities[type] ||
                <{ [key in AbilityPermissionKey]: Permission<U, unknown>[] }>{}
            this.abilities[type][act] = this.abilities[type][act] || []
            this.abilities[type][act].push(
                new Permission(act, criteria, PermissionType.DISALLOW)
            )
        })
    }

    interface = (): AbilityInterface<U> => {
        return { allow: this.allow, disallow: this.disallow }
    }

    private checkPermission = <T>(
        action: Permissions | string,
        user: U,
        entity: T,
        type?: string
    ) => {
        const isClassType = entity.constructor.name === 'Function'
        const derivedType =
            type ||
            (isClassType
                ? (<new (...args: unknown[]) => T>(<unknown>entity)).name
                : entity.constructor.name)

        const permissionChain = (
            this.abilities[derivedType][action] || []
        ).filter(
            (perm: Permission<U, T>) =>
                (isClassType && perm.isClassLevelPermission()) || !isClassType
        )

        const groupedPermissions = permissionChain.reduce(
            (
                acc: {
                    [PermissionType.ALLOW]: boolean[]
                    [PermissionType.DISALLOW]: boolean[]
                },
                perm: Permission<U, T>
            ) => {
                acc[perm.type].push(perm.evaluate(user, entity))
                return acc
            },
            { [PermissionType.ALLOW]: [], [PermissionType.DISALLOW]: [] }
        )

        const allowed = [
            false,
            ...groupedPermissions[PermissionType.ALLOW],
        ].reduce((a, b) => a || b)
        const disallowed = [
            false,
            ...groupedPermissions[PermissionType.DISALLOW],
        ].reduce((a, b) => a || b)

        return allowed && !disallowed
    }

    permits = (
        user: U
    ): {
        toPerform: (
            action: Permissions | string
        ) => {
            on: <T>(
                entity: (new (...args: unknown[]) => T) | T,
                type?: string
            ) => boolean
        }
    } => {
        return {
            toPerform: (
                action: Permissions | string
            ): {
                on: <T>(
                    entity: (new (...args: unknown[]) => T) | T,
                    type?: string
                ) => boolean
            } => {
                return {
                    on: <T>(
                        entity: (new (...args: unknown[]) => T) | T,
                        type?: string
                    ) => {
                        return this.checkPermission(action, user, entity, type)
                    },
                }
            },
        }
    }

    ensure = (
        user: U
    ): {
        canPerform: (
            action: Permissions | string
        ) => {
            on: <T>(
                entity: (new (...args: unknown[]) => T) | T,
                type?: string
            ) => boolean
        }
    } => {
        return {
            canPerform: (
                action: Permissions | string
            ): {
                on: <T>(
                    entity: (new (...args: unknown[]) => T) | T,
                    type?: string
                ) => boolean
            } => {
                return {
                    on: <T>(
                        entity: (new (...args: unknown[]) => T) | T,
                        type?: string
                    ) => {
                        if (!this.checkPermission(action, user, entity, type))
                            throw new NotAuthorizedError(
                                'Not authorized to perform this action.'
                            )
                        return true
                    },
                }
            },
        }
    }
}

enum PermissionType {
    ALLOW,
    DISALLOW,
}

class Permission<U, T> {
    permission: Permissions | string
    criteria: EntityLevelFunction<U, T> | ClassLevelFunction<U>
    type: PermissionType

    constructor(
        permission: Permissions | string,
        criteria: EntityLevelFunction<U, T> | ClassLevelFunction<U>,
        type: PermissionType
    ) {
        this.permission = permission
        this.criteria = criteria
        this.type = type
    }

    private isClassLevelCriteriaType = <U, T>(
        criteria: EntityLevelFunction<U, T> | ClassLevelFunction<U>
    ): criteria is ClassLevelFunction<U> => {
        return criteria.length === 1
    }

    isClassLevelPermission = (): boolean => {
        if (this.isClassLevelCriteriaType(this.criteria)) {
            return true
        }
    }

    evaluate = (user: U, entity?: T) => {
        if (this.isClassLevelCriteriaType(this.criteria)) {
            return this.criteria(user)
        } else {
            return this.criteria(user, entity)
        }
    }
}
