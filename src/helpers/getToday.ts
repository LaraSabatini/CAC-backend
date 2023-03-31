export const today = new Date()
const getDay = today.getDate()
const getMonth = today.getMonth() + 1
export const year = today.getFullYear()
export const day = getDay > 9 ? getDay : `0${getDay}`
export const month = getMonth > 9 ? getMonth : `0${getMonth}`

export const dateFormated = `${day}-${month}-${year}`
