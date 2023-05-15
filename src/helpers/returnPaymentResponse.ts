import config from "../config/index"

const returnPaymentResponse = (type: "subscription" | "update") => {
  const successURL =
    type === "subscription"
      ? `${config.FONT_URL}/payment?payment_status=success`
      : `${config.FONT_URL}/profile?payment_status=success`
  const failureURL =
    type === "subscription"
      ? `${config.FONT_URL}/payment?payment_status=failure`
      : `${config.FONT_URL}/profile?payment_status=failure`

  const pendingURL =
    type === "subscription"
      ? `${config.FONT_URL}/payment?payment_status=pending`
      : `${config.FONT_URL}/profile?payment_status=pending`

  return {
    success: successURL,
    failure: failureURL,
    pending: pendingURL,
  }
}

export default returnPaymentResponse
