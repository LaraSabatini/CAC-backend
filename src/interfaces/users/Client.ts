import User from "./User"

interface Client extends User {
  name: string
  lastName: string
  email: string
  identificationType: string
  identificationNumber: string
  phoneAreaCode: string
  phoneNumber: string
  password: string
  preferences: number[]
  subscription: 1 | 0
  dateCreated: string
}

export default Client
