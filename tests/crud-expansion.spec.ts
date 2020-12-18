import Ability, { Permissions } from '../src/index'
import User from './user'
import { EntityA, EntityB } from './entity'

describe('ability', () => {
    it('fans CRUD out to cover create, read, update, and delete for allow', () => {
        const userAbility = new Ability<User>((abilityInterface) => {
            const { allow } = abilityInterface
            allow(Permissions.CRUD, EntityA, (user: User) => {
                return user.roles.includes('roleA')
            })

            allow(Permissions.CRUD, EntityB, (user: User) => {
                return user.roles.includes('roleB')
            })
        })

        const user = new User(['roleA'])
        const user2 = new User(['roleB'])

        const entity = new EntityA(user.id)
        const entity2 = new EntityB(user.id)

        expect(
            userAbility.permits(user).toPerform(Permissions.CREATE).on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user).toPerform(Permissions.READ).on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user).toPerform(Permissions.UPDATE).on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user).toPerform(Permissions.DELETE).on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.CREATE).on(entity)
        ).toBeFalsy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.READ).on(entity)
        ).toBeFalsy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.UPDATE).on(entity)
        ).toBeFalsy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.DELETE).on(entity)
        ).toBeFalsy()

        expect(
            userAbility.permits(user2).toPerform(Permissions.CREATE).on(entity2)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.READ).on(entity2)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.UPDATE).on(entity2)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.DELETE).on(entity2)
        ).toBeTruthy()
        expect(
            userAbility.permits(user).toPerform(Permissions.CREATE).on(entity2)
        ).toBeFalsy()
        expect(
            userAbility.permits(user).toPerform(Permissions.READ).on(entity2)
        ).toBeFalsy()
        expect(
            userAbility.permits(user).toPerform(Permissions.UPDATE).on(entity2)
        ).toBeFalsy()
        expect(
            userAbility.permits(user).toPerform(Permissions.DELETE).on(entity2)
        ).toBeFalsy()
    })

    it('fans CRUD out to cover create, read, update, and delete for disallow', () => {
        const userAbility = new Ability<User>((abilityInterface) => {
            const { allow, disallow } = abilityInterface
            disallow(Permissions.CRUD, EntityA, (user: User) => {
                return user.roles.includes('roleB')
            })

            allow(Permissions.CRUD, EntityA, (user: User) => {
                return user.roles.includes('roleA')
            })
        })

        const user = new User(['roleA'])
        const user2 = new User(['roleA', 'roleB'])

        const entity = new EntityA(user.id)

        expect(
            userAbility.permits(user).toPerform(Permissions.CREATE).on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user).toPerform(Permissions.READ).on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user).toPerform(Permissions.UPDATE).on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user).toPerform(Permissions.DELETE).on(entity)
        ).toBeTruthy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.CREATE).on(entity)
        ).toBeFalsy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.READ).on(entity)
        ).toBeFalsy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.UPDATE).on(entity)
        ).toBeFalsy()
        expect(
            userAbility.permits(user2).toPerform(Permissions.DELETE).on(entity)
        ).toBeFalsy()
    })
})
