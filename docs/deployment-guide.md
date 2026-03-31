# Deployment Guide — Ubuntu VPS + Cloudflare Tunnel

No open ports needed. Cloudflare Tunnel handles SSL and routing.

```
Browser → Cloudflare Edge (SSL) → Tunnel → VPS (no open ports)
                                              └── Express :3001
                                                   ├── dist/  (static frontend)
                                                   └── /api/* (port checker)
```

---

## Part 1: VPS Setup

### Step 1 — Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # should show v20.x
```

### Step 2 — Clone & Build
```bash
cd /opt
git clone https://github.com/ngocthanh1908/network-toolkit.git
cd network-toolkit
npm install
npm run build
```

### Step 3 — Test it works
```bash
npx tsx server/index.ts
# Open another terminal:
curl http://localhost:3001          # should return HTML
curl "http://localhost:3001/api/port-check?host=google.com&port=80"  # should return JSON
# Ctrl+C to stop
```

### Step 4 — Create systemd service
```bash
cat <<'EOF' | sudo tee /etc/systemd/system/network-toolkit.service
[Unit]
Description=Network Toolkit
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/network-toolkit
ExecStart=/usr/bin/npx tsx server/index.ts
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now network-toolkit
sudo systemctl status network-toolkit
```

---

## Part 2: Cloudflare Tunnel

### Step 5 — Install cloudflared on VPS
```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
cloudflared --version
```

### Step 6 — Login to Cloudflare
```bash
cloudflared tunnel login
```
It prints a URL — open it in your browser, select your domain, authorize.

### Step 7 — Create tunnel
```bash
cloudflared tunnel create network-toolkit
```
Save the **Tunnel ID** from the output (e.g. `a1b2c3d4-...`).

### Step 8 — Add DNS route
Replace `tools.yourdomain.com` with your subdomain:
```bash
cloudflared tunnel route dns network-toolkit tools.yourdomain.com
```

### Step 9 — Create tunnel config
Replace `<TUNNEL_ID>` with your actual tunnel ID:
```bash
cat <<'EOF' | sudo tee /root/.cloudflared/config.yml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: tools.yourdomain.com
    service: http://localhost:3001
  - service: http_status:404
EOF
```

### Step 10 — Run tunnel as a service
```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared
```

### Step 11 — Verify
Open `https://tools.yourdomain.com` in your browser. Done!

---

## Updating

```bash
cd /opt/network-toolkit
git pull
npm install
npm run build
sudo systemctl restart network-toolkit
```

## Troubleshooting

| Command | Purpose |
|---------|---------|
| `sudo systemctl status network-toolkit` | Check app status |
| `sudo journalctl -u network-toolkit -f` | Tail app logs |
| `sudo systemctl status cloudflared` | Check tunnel status |
| `sudo journalctl -u cloudflared -f` | Tail tunnel logs |
| `curl http://localhost:3001` | Test app locally |
| `cloudflared tunnel info network-toolkit` | Tunnel details |
