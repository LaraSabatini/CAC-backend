interface Admin {
  id?: number
  userName: string
  email: string
  password: string
  accessPermits: JSON
  loginAttempts: number
  accountBlocked: 0 | 1
}

export default Admin
