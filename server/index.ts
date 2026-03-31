import express from 'express';
import cors from 'cors';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());

/* Serve built frontend in production */
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('/api/port-check', (req, res) => {
    const host = String(req.query.host ?? '');
    const port = parseInt(String(req.query.port ?? '0'));
    const timeout = 3000;

    if (!host || !port || port < 1 || port > 65535) {
        res.status(400).json({ error: 'Invalid host or port' });
        return;
    }

    const socket = new net.Socket();
    let status = 'closed';

    socket.setTimeout(timeout);

    socket.on('connect', () => {
        status = 'open';
        socket.destroy();
    });

    socket.on('timeout', () => {
        status = 'timeout';
        socket.destroy();
    });

    socket.on('error', () => {
        status = 'closed';
    });

    socket.on('close', () => {
        res.json({ host, port, status });
    });

    socket.connect(port, host);
});

/* SPA fallback — serve index.html for all non-API routes (Express 5 wildcard syntax) */
app.get('{*path}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});