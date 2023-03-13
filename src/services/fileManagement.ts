import path from "path"
import fs from "fs"
import statusCodes from "../config/statusCodes"

const uploadFiles = async (req: any, res: any) => {
  const newpath = `${__dirname.split("services")[0]}files/`
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

const getFile = async (req: any, res: any, next: any) => {
  const options = {
    root: `${path.join(__dirname).split("services")[0]}files`,
  }

  const fileName = req.params.file_name
  const fileExtension = req.params.file_extension

  res.sendFile(`${fileName}.${fileExtension}`, options, (err: any) => {
    if (err) {
      next(err)
    }
  })
}

const deleteFile = async (req: any, res: any) => {
  fs.unlink(req.params.route, error => {
    if (error) {
      res.status(500).send({
        message: "Server error",
        code: statusCodes.INTERNAL_SERVER_ERROR,
      })
    } else {
      res
        .status(201)
        .send({ message: "File deleted successfully", code: statusCodes.OK })
    }
  })
}

export { uploadFiles, getFile, deleteFile }
