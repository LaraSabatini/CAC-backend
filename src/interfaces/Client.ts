interface Client {
  id: number
  userName: string
  email: string
  password: string
  contactInfo: {
    phone: number
    address: {
      street: string
      streetNumber: number
      neighbourhood: string
      state: string
      country: string
    }
  }
  preferences: number[]
  accountBlocked: boolean
  subscription: boolean
}

export default Client
