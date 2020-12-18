import Ability, { PERMISSIONS, AbilityInterface } from '../src/index';
import { EntityA } from './entity';
import User from './user';

describe("ability", () => {
  it("evaluates an allow disallow chain", () => {

    // It should allow as long as there is at least one allow without a disallow
    const userAbility = new Ability<User>(abilityInterface => {
      const { allow, disallow } = abilityInterface;
      allow(PERMISSIONS.READ, EntityA, (user: User) => {
        return user.roles.includes("role1");
      });
      allow(PERMISSIONS.READ, EntityA, (user: User) => {
        return user.roles.includes("role2");
      });
      allow(PERMISSIONS.READ, EntityA, (user: User) => {
        return user.roles.includes("role3");
      });
      allow(PERMISSIONS.READ, EntityA, (user: User) => {
        return user.roles.includes("role4");
      });
      disallow(PERMISSIONS.READ, EntityA, (user: User) => {
        return user.roles.includes("role5");
      });
      disallow(PERMISSIONS.READ, EntityA, (user: User, entity: EntityA) => {
        return entity.userId === user.id;
      });
    });

    const user1 = new User(['role1']);
    const user2 = new User(['role2']);
    const user3 = new User(['role3', 'role5']);
    const user4 = new User(['role4']);
    const user5 = new User(['role1']);
    const entity = new EntityA(user5.id);

    expect(userAbility.permits(user1).toPerform(PERMISSIONS.READ).on(entity)).toBeTruthy();
    expect(userAbility.permits(user2).toPerform(PERMISSIONS.READ).on(entity)).toBeTruthy();
    expect(userAbility.permits(user3).toPerform(PERMISSIONS.READ).on(entity)).toBeFalsy();
    expect(userAbility.permits(user4).toPerform(PERMISSIONS.READ).on(entity)).toBeTruthy();
    expect(userAbility.permits(user5).toPerform(PERMISSIONS.READ).on(entity)).toBeFalsy();

  });
});