import Ability, { Permissions } from '../src/index'
import User from './user'
import { EntityA } from './entity'

describe('ability', () => {
    it('allows a user to perform an action', () => {
        const userAbility = new Ability<User>((abilityInterface) => {
            const { allow } = abilityInterface
            allow(Permissions.READ, EntityA, (user: User) => {
                return user.roles.includes('roleA')
            })
        })

        const user = new User(['roleA'])
        const user2 = new User(['roleB'])

        expect(
            userAbility.permits(user).toPerform(Permissions.READ).on(EntityA)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.READ).on(EntityA)
        ).toBeFalsy()
        expect(
            userAbility.permits(user).toPerform(Permissions.UPDATE).on(EntityA)
        ).toBeFalsy()
    })

    it('disallows a user to perform an action with hybrid rule definitions on a class', () => {
        const userAbility = new Ability<User>((abilityInterface) => {
            const { allow } = abilityInterface
            allow(Permissions.READ, EntityA, (user: User) => {
                return user.roles.includes('roleB')
            })

            allow(Permissions.READ, EntityA, (user: User, entity: EntityA) => {
                return user.roles.includes('roleA') && entity.userId === 'abcd'
            })
        })

        const user = new User(['roleA'])
        const user2 = new User(['roleA', 'roleB'])

        expect(
            userAbility.permits(user).toPerform(Permissions.READ).on(EntityA)
        ).toBeFalsy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.READ).on(EntityA)
        ).toBeTruthy()
    })

    it('disallows a user to perform an action with hybrid rule definitions on an entity', () => {
        const userAbility = new Ability<User>((abilityInterface) => {
            const { allow, disallow } = abilityInterface
            disallow(Permissions.READ, EntityA, (user: User) => {
                return user.roles.includes('roleB')
            })

            allow(Permissions.READ, EntityA, (user: User, entity: EntityA) => {
                return user.roles.includes('roleA') && entity.userId === 'abcd'
            })
        })

        const user = new User(['roleA'])
        const user2 = new User(['roleA', 'roleB'])
        const entity = new EntityA('abcd')

        expect(
            userAbility.permits(user).toPerform(Permissions.READ).on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.READ).on(entity)
        ).toBeFalsy()
    })

    it('disallows a user from performing an action', () => {
        const userAbility = new Ability<User>((abilityInterface) => {
            const { allow, disallow } = abilityInterface
            allow(Permissions.READ, EntityA, (user: User) => {
                return user.roles.includes('role')
            })

            disallow(Permissions.READ, EntityA, (user: User) => {
                return user.roles.includes('badrole')
            })
        })

        const user = new User(['role'])
        const user2 = new User(['badrole'])

        expect(
            userAbility.permits(user).toPerform(Permissions.READ).on(EntityA)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.READ).on(EntityA)
        ).toBeFalsy()
    })
})
