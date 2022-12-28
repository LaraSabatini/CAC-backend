interface Client {
  id: number
  userName: string
  email: string
  password: string
  contactInfo: {
    // JSON
    phone: number
    address: {
      street: string
      streetNumber: number
      neighbourhood: string
      state: string
      country: string
    }
  }
  preferences: number[] // JSON
  accountBlocked: boolean // 0 || 1
  subscription: boolean // active | inactive
}

export default Client
