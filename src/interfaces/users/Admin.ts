import User from "./User"

interface Admin extends User {
  userName: string
  accessPermits: JSON
  loginAttempts: number
}

export default Admin
