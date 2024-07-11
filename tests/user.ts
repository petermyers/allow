import { faker } from '@faker-js/faker'

export default class User {
    id: string
    firstName: string
    lastName: string
    roles: string[]

    constructor(roles: string[]) {
        this.roles = roles
        this.id = faker.string.alphanumeric({ length: 10 })
        this.firstName = faker.person.firstName()
        this.lastName = faker.person.lastName()
    }
}
