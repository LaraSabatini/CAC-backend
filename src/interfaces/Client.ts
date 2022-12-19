interface Client {
  id: number
  userName: string
  email: string
  password: string
  contact_info: { // JSON
    phone: number
    address: {
      street: string
      street_number: number
      neighbourhood: string
      state: string
      country: string
    }
  }
  preferences: number[] // JSON
  accountBlocked: boolean // 0 || 1
  subscription: boolean // active | inactive
}
  
export default Client;