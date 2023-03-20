import sendEmail from "../helpers/sendEmail"

const unblockRequest = async (req: any, res: any) => {
  return sendEmail(
    [req.body.recipients],
    "Solicitud de desbloqueo de cuenta",
    "unblockAccountRequest",
    {
      name: req.body.name,
      clientName: req.body.clientName,
      unblockURL: req.body.unblockURL,
    },
    res,
  )
}

// eslint-disable-next-line import/prefer-default-export
export { unblockRequest }
