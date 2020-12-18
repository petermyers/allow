import Ability, { Permissions } from '../src/index';
import User from './user';
import { EntityA, EntityB } from './entity';

describe("ability", () => {
  it("allows a user to perform an action", () => {
    
    const userAbility = new Ability<User>(abilityInterface => {
      const { allow } = abilityInterface;
      allow(Permissions.READ, EntityA, (user: User, entity: EntityA) => {
        return user.roles.includes("roleA");
      });

      allow(Permissions.READ, EntityB, (user: User, entity: EntityB) => {
        return user.roles.includes("roleB");
      });
    });

    const user = new User(["roleA"]);
    const user2 = new User(["roleB"]);
    const entity = new EntityA(user.id);
    const entity2 = new EntityB(user.id);

    expect(userAbility.permits(user).toPerform(Permissions.READ).on(entity)).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(Permissions.READ).on(entity)).toBeFalsy();

    expect(userAbility.permits(user).toPerform(Permissions.READ).on(entity2)).toBeFalsy();
    expect(userAbility.permits(user2).toPerform(Permissions.READ).on(entity2)).toBeTruthy();

  });

});