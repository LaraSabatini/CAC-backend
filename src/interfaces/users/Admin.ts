import User from "./User"

interface Admin extends User {
  accessPermits: JSON
  loginAttempts: number
  userName: string
  profilePic: string
}

export default Admin
