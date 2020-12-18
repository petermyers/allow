import Ability, { Permissions } from '../src/index'
import User from './user'
import { EntityA } from './entity'

describe('ability', () => {
    it('allows a user to perform an action', () => {
        const userAbility = new Ability<User>((abilityInterface) => {
            const { allow } = abilityInterface
            allow('action.custom', EntityA, (user: User, entity: EntityA) => {
                return entity.userId === user.id && user.roles.includes('role')
            })
        })

        const user = new User(['role'])
        const user2 = new User(['role'])
        const entity = new EntityA(user.id)

        expect(
            userAbility.permits(user).toPerform('action.custom').on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform('action.custom').on(entity)
        ).toBeFalsy()
        expect(
            userAbility.permits(user).toPerform(Permissions.READ).on(entity)
        ).toBeFalsy()
    })

    it('disallows a user from performing an action', () => {
        const userAbility = new Ability<User>((abilityInterface) => {
            const { allow, disallow } = abilityInterface
            allow('action.custom', EntityA, (user: User) => {
                return user.roles.includes('role')
            })

            disallow('action.custom', EntityA, (user: User) => {
                return user.roles.includes('badrole')
            })
        })

        const user = new User(['role'])
        const user2 = new User(['badrole'])
        const entity = new EntityA(user2.id)

        expect(
            userAbility.permits(user).toPerform('action.custom').on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform('action.custom').on(entity)
        ).toBeFalsy()
    })
})
