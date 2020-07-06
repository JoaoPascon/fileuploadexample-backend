const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')


const s3Storage = multerS3({
        s3: new aws.S3(),
        bucket: 'nome_do_bucket',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if(err) cb(err);

                const fileName = `${hash.toString('hex')}-${file.originalname}`
                cb(null, fileName);
            })
        }
})

const localStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads')),
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
            if(err) cb(err);

            file.key = `${hash.toString('hex')}-${file.originalname}`
            cb(null, file.key);
        })
    }
})

const storageTypes = {
    local: localStorage,
    s3: s3Storage 
}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        fileSize: 1024 * 2 * 1024           
    },
    fileFilter: (req, res, cb) => {
        mimeTypesAllowed = ['image/png', 'image/jpeg', 'image/gif', 'image/pjpeg'];
        
        if(mimeTypesAllowed.includes(res.mimetype)){
            cb(null, true);
        } else {
            cb(new Error('Invalid file type!'))
        }
    }

}