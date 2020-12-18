import * as faker from 'faker';

export class EntityA {
  id: string;
  userId: string;

  constructor(userId: string) {
    this.id = faker.random.alphaNumeric(10);
    this.userId = userId;
  }
}

export class EntityB {
  id: string;
  userId: string;

  constructor(userId: string) {
    this.id = faker.random.alphaNumeric(10);
    this.userId = userId;
  }
}