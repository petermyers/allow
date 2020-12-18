import Ability, { PERMISSIONS } from '../src/index';
import User from './user';
import { EntityA, EntityB } from './entity';

describe("ability", () => {
  it("allows a user to perform an action", () => {
    
    const userAbility = new Ability<User>(abilityInterface => {
      const { allow } = abilityInterface;
      allow(PERMISSIONS.READ, EntityA, (user: User, entity: EntityA) => {
        return entity.userId === user.id && user.roles.includes("role");
      });
    });

    const user = new User(["role"]);
    const user2 = new User(["role"]);
    const entity = new EntityA(user.id);

    expect(userAbility.permits(user).toPerform(PERMISSIONS.READ).on(entity)).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.READ).on(entity)).toBeFalsy();
    expect(userAbility.permits(user).toPerform(PERMISSIONS.UPDATE).on(entity)).toBeFalsy();

  });

  it("disallows a user from performing an action", () => {
    const userAbility = new Ability<User>(abilityInterface => {
      const { allow, disallow } = abilityInterface;
      allow(PERMISSIONS.READ, EntityA, (user: User, entity: EntityA) => {
        return user.roles.includes("role");
      });

      disallow(PERMISSIONS.READ, EntityA, (user: User, entity: EntityA) => {
        return user.roles.includes('badrole');
      });
    });

    const user = new User(["role"]);
    const user2 = new User(["badrole"]);
    const entity = new EntityA(user2.id);

    expect(userAbility.permits(user).toPerform(PERMISSIONS.READ).on(entity)).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.READ).on(entity)).toBeFalsy();
  });
});