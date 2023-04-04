import User from "./User"

interface Client extends User {
  name: string
  lastName: string
  identificationType: string
  identificationNumber: string
  phoneAreaCode: string
  phoneNumber: string
  preferences: number[]
  subscription: 1 | 0 | null
  dateCreated: string
  plan: number | null
  region: number
  paymentDate: string | null
  paymentExpireDate: string | null
  mpId: string
  savedArticles: number[]
}

export default Client
