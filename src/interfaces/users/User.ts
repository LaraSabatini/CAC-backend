interface User {
  id?: number
  email: string
  password: string
  loginAttempts: number
  accountBlocked: 0 | 1
}

export default User
