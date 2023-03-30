interface User {
  id?: number
  email: string
  password: string
  loginAttempts: number | null
  accountBlocked: 0 | 1
  firstLogin: 0 | 1
}

export default User
