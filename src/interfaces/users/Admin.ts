import User from "./User"

interface Admin extends User {
  accessPermits: JSON
  loginAttempts: number
  userName: string
}

export default Admin
