import axios from "axios"

const axiosHeader = {
  headers: {
    "Content-Type": "application/json",
  },
}

const defaultPost = async (apiURL: string, body: any) => {
  const data = await axios
    .post(`${apiURL}`, body, axiosHeader)
    .then(response => {
      const res = response.data
      return res
    })
    .catch(err => {
      const res = err.response.data
      return res
    })
  return data
}

export default defaultPost
