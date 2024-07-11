import { faker } from '@faker-js/faker'

export class EntityA {
    id: string
    userId: string

    constructor(userId: string) {
        this.id = faker.string.alphanumeric({ length: 10 })
        this.userId = userId
    }
}

export class EntityB {
    id: string
    userId: string

    constructor(userId: string) {
        this.id = faker.string.alphanumeric({ length: 10 })
        this.userId = userId
    }
}
