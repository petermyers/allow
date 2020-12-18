import Ability, { Permissions } from '../src/index';
import User from './user';
import { EntityA, EntityB } from './entity';

describe("ability", () => {
  it("allows a user to perform an action", () => {
    
    const userAbility = new Ability<User>(abilityInterface => {
      const { allow } = abilityInterface;
      allow(Permissions.READ, 'type.custom', (user: User, entity: any) => {
        return entity.userId === user.id && user.roles.includes("role");
      });
    });

    const user = new User(["role"]);
    const user2 = new User(["role"]);
    const entity = { userId: user.id };

    expect(userAbility.permits(user).toPerform(Permissions.READ).on(entity, 'type.custom')).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(Permissions.READ).on(entity, 'type.custom')).toBeFalsy();
    expect(userAbility.permits(user).toPerform(Permissions.UPDATE).on(entity, 'type.custom')).toBeFalsy();

  });

  it("disallows a user from performing an action", () => {
    const userAbility = new Ability<User>(abilityInterface => {
      const { allow, disallow } = abilityInterface;
      allow(Permissions.READ, 'type.custom', (user: User, entity: any) => {
        return user.roles.includes("role");
      });

      disallow(Permissions.READ, 'type.custom', (user: User, entity: any) => {
        return user.roles.includes('badrole');
      });
    });

    const user = new User(["role"]);
    const user2 = new User(["badrole"]);
    const entity = { userId: user.id };

    expect(userAbility.permits(user).toPerform(Permissions.READ).on(entity, 'type.custom')).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(Permissions.READ).on(entity, 'type.custom')).toBeFalsy();
  });
});