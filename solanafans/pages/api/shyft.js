import axios from 'axios';

export default async function handler(req, res) {
    try {
        // Realizar la llamada a la API de Shyft

        
        console.log(req.publicKey?req.publicKey:'valio');
        const response = await axios.get(`https://api.shyft.to/sol/v1/wallet/balance?network=testnet&wallet=${req.publicKey}`, { "x-api-key": process.env.shyftkey });
        // Procesar la respuesta de la API de Shyft
        const data = response.data;

        // Devolver los datos obtenidos como respuesta de la API de Next.js
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al llamar a la API de Shyft' });
    }
}
