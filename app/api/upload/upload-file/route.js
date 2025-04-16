import { NextResponse } from 'next/server';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import connectDb from '@/lib/ connectDb';

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        await connectDb();
        const buffer = await new Promise((resolve, reject) => {
            upload.single('file')(req, null, (err) => {
                if (err) reject(err);
                else resolve(req.file?.buffer);
            });
        });

        if (!buffer) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const fileBase64 = buffer.toString('base64');
        const dataUri = `data:;base64,${fileBase64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            resource_type: 'auto',
        });

        return NextResponse.json({ url: result.secure_url }, { status: 200 });
    } catch (err) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
