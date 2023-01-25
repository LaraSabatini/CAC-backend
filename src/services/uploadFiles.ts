import statusCodes from "../config/statusCodes"

const uploadFiles = async (req: any, res: any) => {
  const newpath = `${__dirname}/files/`
  const { file }: any = req.files
  const filename = file.name

  file.mv(`${newpath}${filename}`, (err: any) => {
    if (err) {
      res.status(500).send({
        message: "File upload failed",
        code: statusCodes.INTERNAL_SERVER_ERROR,
      })
    }
    res
      .status(200)
      .send({ message: "File Uploaded", code: statusCodes.CREATED })
  })
}

export default uploadFiles
