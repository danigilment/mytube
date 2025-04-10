import videofile from "../Models/videofile.js"
import path from "path"
import fs from "fs"

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    res.status(404).json({ message: "plz upload a mp.4 video file only" })
  } else {
    try {
      const file = new videofile({
        videotitle: req.body.title,
        filename: req.file.originalname,
        filepath: req.file.path,
        filetype: req.file.mimetype,
        filesize: req.file.size,
        videochanel: req.body.chanel,
        uploader: req.body.uploader,
      })
      // console.log(file)
      await file.save()
      res.status(200).send("File uploaded successfully")
    } catch (error) {
      res.status(404).json(error.message)
      return
    }
  }
}

export const getallvideos = async (req, res) => {
  try {
    const files = await videofile.find()
    res.status(200).send(files)
  } catch (error) {
    res.status(404).json(error.message)
    return
  }
}

// Add a new function to handle direct video downloads
export const downloadVideoFile = async (req, res) => {
  try {
    const { filepath } = req.params

    // Decode the filepath parameter
    const decodedFilepath = decodeURIComponent(filepath)

    // Get the absolute path to the file
    const filePath = path.resolve(decodedFilepath)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" })
    }

    // Get file information
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const fileName = path.basename(filePath)

    // Set headers for download
    res.setHeader("Content-Length", fileSize)
    res.setHeader("Content-Type", "video/mp4")
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
  } catch (error) {
    console.error("Error downloading file:", error)
    res.status(500).json({ message: "Error downloading file" })
  }
}
