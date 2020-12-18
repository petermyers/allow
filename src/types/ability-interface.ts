import { Permissions } from './permissions'

export type EntityLevelFunction<U, T> = (user: U, entity: T) => boolean
export type ClassLevelFunction<U> = (user: U) => boolean

export type PermissioningFunction<U> = <T>(
    action: Permissions | string,
    entity: (new (...args: unknown[]) => T) | string,
    criteria: EntityLevelFunction<U, T> | ClassLevelFunction<U>
) => void

export type AbilityInterface<U> = {
    allow: PermissioningFunction<U>
    disallow: PermissioningFunction<U>
}
