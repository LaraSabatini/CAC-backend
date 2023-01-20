import User from "./User"

interface Admin extends User {
  accessPermits: JSON
  loginAttempts: number
}

export default Admin
