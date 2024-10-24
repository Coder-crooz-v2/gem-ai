import express from 'express';
import * as dotenv from 'dotenv';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
    });
}

router.route('/').get((req, res) => {
    res.json({ text: "Hello World" });
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        async function query(data) {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
                {
                    headers: {
                        Authorization: `Bearer ${process.env.HUGGING_IMG_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(data),
                }
            );
            const result = await response.blob();
            return result;
        }
        query({ "inputs": prompt }).then(async (response) => {
            let buffer = Buffer.from(await response.arrayBuffer());
            const image = buffer.toString('base64');
            res.status(200).json({ photo: image });
        }).catch(err => { throw err });

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
});

export default router;