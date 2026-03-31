# Deployment Guide — Ubuntu VPS with Nginx

## Prerequisites
- Ubuntu 20.04+ VPS with SSH access
- Domain pointing to VPS IP (A record)

## 1. Install Node.js 20 + Nginx
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
```

## 2. Clone & Build
```bash
cd /opt
git clone https://github.com/ngocthanh1908/network-toolkit.git
cd network-toolkit
npm install
npm run build
```

## 3. Backend Service (systemd)
```bash
cat <<'EOF' | sudo tee /etc/systemd/system/network-toolkit.service
[Unit]
Description=Network Toolkit Backend
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/network-toolkit
ExecStart=/usr/bin/npx tsx server/index.ts
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now network-toolkit
```

Verify: `sudo systemctl status network-toolkit`

## 4. Nginx Config
Replace `your-domain.com` with actual domain:
```bash
cat <<'EOF' | sudo tee /etc/nginx/sites-available/network-toolkit
server {
    listen 80;
    server_name your-domain.com;

    root /opt/network-toolkit/dist;
    index index.html;

    # SPA — serve index.html for all frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API to Express backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/network-toolkit /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## 5. SSL (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Auto-renewal is configured by default via systemd timer.

## 6. Updating
```bash
cd /opt/network-toolkit
git pull
npm install
npm run build
sudo systemctl restart network-toolkit
```

## Architecture on VPS
```
Browser → Nginx (port 80/443)
            ├── Static files (dist/)  → served directly
            └── /api/*                → proxy to Express (port 3001)
```

## Troubleshooting
- `sudo systemctl status network-toolkit` — check backend logs
- `sudo nginx -t` — validate nginx config
- `sudo journalctl -u network-toolkit -f` — tail backend logs
- `curl http://localhost:3001/api/port-check?host=google.com&port=80` — test backend directly
