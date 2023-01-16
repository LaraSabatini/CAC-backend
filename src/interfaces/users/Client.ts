import User from "./User"

interface Client extends User {
  name: string
  lastName: string
  identificationType: string
  identificationNumber: string
  phoneAreaCode: string
  phoneNumber: string
  preferences: number[]
  subscription: 1 | 0
  dateCreated: string
}

export default Client
