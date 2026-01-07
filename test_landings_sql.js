
import { obtenerTodasLasLandings } from './backend/services/landingsService.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        console.log("Testing obtenerTodasLasLandings...");
        const res = await obtenerTodasLasLandings();
        console.log("Success! Count:", res.length);
        console.log("First item:", res[0]);
        process.exit(0);
    } catch(e) {
        console.error("FAILED:", e);
        process.exit(1);
    }
}

test();
