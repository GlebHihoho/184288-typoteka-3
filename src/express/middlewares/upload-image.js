'use strict';

const path = require(`path`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../../../upload`;
const MAX_ID_LENGTH = 10;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, cb) => {
    const uniqueName = nanoid(MAX_ID_LENGTH);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

module.exports = multer({storage});
