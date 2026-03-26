# 🌐 Network Toolkit

A personal network utility web app for IT infrastructure professionals.
Built with React + TypeScript + MUI. Runs entirely in the browser.

## Features
- 🔍 **IP Lookup** — get geolocation & ISP info for any IP
- 🌐 **DNS Lookup** — query A, MX, CNAME records for any domain
- 🧮 **Subnet Calculator** — calculate hosts, range from CIDR notation
- 📡 **Port Checker** — check if a port is open (requires backend)
- 📋 **History** — view & export past lookups as CSV

## Tech Stack
- React 18 + TypeScript + Vite
- Material UI (MUI) v5
- React Router v6
- Vercel (hosting)

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run
```bash
git clone https://github.com/YOUR_USERNAME/network-toolkit.git
cd network-toolkit
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

## Project Structure
```
src/
├── components/    # Reusable UI components
├── pages/         # One component per route
├── hooks/         # Custom React hooks
├── utils/         # Helper functions
├── types/         # TypeScript types
└── constants/     # App constants
```

## Roadmap
- [x] Phase 1 — Project setup & layout
- [ ] Phase 2 — IP Lookup
- [ ] Phase 3 — DNS Lookup
- [ ] Phase 4 — Subnet Calculator
- [ ] Phase 5 — Port Checker
- [ ] Phase 6 — History & Export

## License
MIT
```

---

## 📁 Cách tạo file trong Antigravity

1. Trong Antigravity, nhìn panel trái → click chuột phải vào thư mục root
2. Chọn **New File**
3. Đặt tên `CLAUDE.md` → paste nội dung vào → `Ctrl+S`
4. Làm tương tự với `README.md`

---

## ✅ Sau khi tạo xong

Cấu trúc project của bạn sẽ trông như thế này:
```
network-toolkit/
├── CLAUDE.md          ← AI đọc file này
├── README.md          ← Con người đọc file này
├── src/
├── package.json
└── ...