interface Client {
  id: number
  name: string
  lastName: string
  email: string
  identificationType: string
  identificationNumber: string
  phoneAreaCode: string
  phoneNumber: string
  password: string
  preferences: number[]
  accountBlocked: boolean
  subscription: boolean
  dateCreated: string
}

export default Client
