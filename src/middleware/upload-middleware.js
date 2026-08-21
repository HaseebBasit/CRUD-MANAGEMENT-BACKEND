import multer from "multer";
import fs from "fs";
import path from "path";


// =========================
// UPLOAD DIRECTORY
// =========================

const uploadPath = path.join(process.cwd(), "uploads");


// Create uploads folder automatically
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
        recursive: true
    });
}


// =========================
// STORAGE
// =========================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadPath);

    },

    filename: function (req, file, cb) {

        const extension =
            path.extname(file.originalname).toLowerCase();

        const fileName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(null, fileName);

    }

});


// =========================
// FILE FILTER
// =========================

const fileFilter = (req, file, cb) => {

    const allowedMimeTypes = [
        "image/png",
        "image/jpeg"
    ];

    const allowedExtensions = [
        ".png",
        ".jpg",
        ".jpeg"
    ];

    const extension =
        path.extname(file.originalname).toLowerCase();

    if (
        allowedMimeTypes.includes(file.mimetype) &&
        allowedExtensions.includes(extension)
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Invalid file type! Only PNG and JPEG/JPG images are allowed."
            ),
            false
        );

    }
};


// =========================
// MULTER
// =========================

const uploadMedia = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


export default uploadMedia;
