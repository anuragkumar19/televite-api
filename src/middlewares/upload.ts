import multer from 'multer'
import crypto from 'crypto'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import asyncHandler from 'express-async-handler'
import cloudinary from '../config/cloudinary'
import { ExpressHandler } from '../types'

//  Multer Cloudinary Storage for post's images
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: `televite_${process.env.NODE_ENV}`,
        public_id: () =>
            crypto
                .createHash('sha256')
                .update(crypto.randomBytes(12).toString('hex'))
                .digest('hex'),
        type: 'private',
    } as any,
})

export const upload = (
    type: 'image' | 'video' | 'any',
    field: string,
    sizeLimit?: number,
    multiple?: boolean
): ExpressHandler =>
    asyncHandler((req, res, next) => {
        const uploaderAlt = multer({
            storage,
            limits: {
                fieldSize: sizeLimit,
            },
            fileFilter: (_req, file, cb) => {
                if (type !== 'any' && !file.mimetype.startsWith(type)) {
                    cb(new Error(`Please upload ${type} Only!`))
                } else {
                    cb(null, true)
                }
            },
        })

        let uploader: ReturnType<typeof uploaderAlt.array>

        if (multiple) {
            uploader = uploaderAlt.array(field)
        } else {
            uploader = uploaderAlt.single(field)
        }

        return new Promise((resolve, reject) => {
            uploader(req, res, (err) => {
                res.status(400)
                if (err) {
                    return reject(new Error(err))
                }

                if (multiple && (!req.files || req.files.length === 0)) {
                    return reject(new Error(`Please select an ${type}`))
                }

                if (!req.file) {
                    return reject(new Error(`Please select an ${type}`))
                }

                res.status(200)
                next()
                resolve(multiple ? req.files : req.file)
            })
        })
    })
