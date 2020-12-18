import Ability, { PERMISSIONS } from '../src/index';
import User from './user';
import { EntityA, EntityB } from './entity';

describe("ability", () => {
  it("fans CRUD out to cover create, read, update, and delete for allow", () => {
    
    const userAbility = new Ability<User>(abilityInterface => {
      const { allow } = abilityInterface;
      allow(PERMISSIONS.CRUD, EntityA, (user: User, entity: EntityA) => {
        return user.roles.includes("roleA");
      });

      allow(PERMISSIONS.CRUD, EntityB, (user: User, entity: EntityB) => {
        return user.roles.includes("roleB");
      });
    });

    const user = new User(["roleA"]);
    const user2 = new User(["roleB"]);

    const entity = new EntityA(user.id);
    const entity2 = new EntityB(user.id);

    expect(userAbility.permits(user).toPerform(PERMISSIONS.CREATE).on(entity)).toBeTruthy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.READ).on(entity)).toBeTruthy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.UPDATE).on(entity)).toBeTruthy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.DELETE).on(entity)).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.CREATE).on(entity)).toBeFalsy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.READ).on(entity)).toBeFalsy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.UPDATE).on(entity)).toBeFalsy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.DELETE).on(entity)).toBeFalsy();

    expect(userAbility.permits(user2).toPerform(PERMISSIONS.CREATE).on(entity2)).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.READ).on(entity2)).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.UPDATE).on(entity2)).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.DELETE).on(entity2)).toBeTruthy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.CREATE).on(entity2)).toBeFalsy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.READ).on(entity2)).toBeFalsy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.UPDATE).on(entity2)).toBeFalsy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.DELETE).on(entity2)).toBeFalsy();

  });

  it("fans CRUD out to cover create, read, update, and delete for disallow", () => {
    
    const userAbility = new Ability<User>(abilityInterface => {
      const { allow, disallow } = abilityInterface;
      disallow(PERMISSIONS.CRUD, EntityA, (user: User, entity: EntityB) => {
        return user.roles.includes("roleB");
      });
      
      allow(PERMISSIONS.CRUD, EntityA, (user: User, entity: EntityA) => {
        return user.roles.includes("roleA");
      });
    });

    const user = new User(["roleA"]);
    const user2 = new User(["roleA", "roleB"]);

    const entity = new EntityA(user.id);

    expect(userAbility.permits(user).toPerform(PERMISSIONS.CREATE).on(entity)).toBeTruthy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.READ).on(entity)).toBeTruthy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.UPDATE).on(entity)).toBeTruthy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.DELETE).on(entity)).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.CREATE).on(entity)).toBeFalsy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.READ).on(entity)).toBeFalsy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.UPDATE).on(entity)).toBeFalsy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.DELETE).on(entity)).toBeFalsy();

  });

});