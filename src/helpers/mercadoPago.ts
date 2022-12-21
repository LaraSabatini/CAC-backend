import mercadopago from "mercadopago"
import config from "../config"

mercadopago.configure({
  access_token: `${config.MP_ACCESS_TOKEN}`,
})

export default mercadopago
