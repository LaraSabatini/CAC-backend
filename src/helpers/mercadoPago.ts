import mercadopago from "mercadopago"
import config from "../config"

mercadopago.configure({
  access_token: `${config.MP_ACCESS_TOKEN_TEST}`,
})

export default mercadopago
