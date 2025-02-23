export class Person {
	name: string
	age: number
	friends: string[]
	id: symbol
	wife: null
	pet: undefined
	self: Person

	constructor(name: string, age: number, friends: string[]) {
		this.name = name
		this.age = age
		this.friends = friends
		this.id = Symbol('identifier')
		this.wife = null
		this.pet = undefined
		this.self = this
	}

	checkAge(): number {
		return this.age
	}
}

export const object = {
	name: 'John',
	age: 30,
	friends: ['Emily', 'Joe'],
	checkAge: () => {
		return object.age
	},
	id: Symbol('identifier'),
	wife: null,
	pet: undefined
}

export const classObject = new Person(object.name, object.age, object.friends)

export default { Person, object, classObject }
