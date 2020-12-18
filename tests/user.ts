import * as faker from 'faker';

export default class User {
  id: string;
  firstName: string;
  lastName: string;
  roles: string[];

  constructor(roles: string[]) {
    this.roles = roles;
    this.id = faker.random.alphaNumeric(10);
    this.firstName = faker.name.firstName();
    this.lastName = faker.name.lastName();
  }
}