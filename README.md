# 🏥 MayerSurokkha AI
### *AI-Powered Maternal Healthcare for Rural & Low-Connectivity Regions*

MayerSurokkha AI is an offline-first maternal healthcare companion designed to predict pregnancy risks and ensure timely care for mothers in underserved rural areas.

## 🚀 Key Features (12-Module System)
1. **User Management**: Multi-role registration (Mother, Doctor, Health Worker).
2. **Pregnancy Data Management**: Full history tracking of symptoms and vitals.
3. **AI Risk Prediction**: Hybrid ML + Rule-based engine (Logistic Regression, Random Forest).
4. **Emergency Alert System**: Immediate alerts for high-risk cases.
5. **Doctor Dashboard**: Real-time patient monitoring and risk trends.
6. **Health Worker Mode**: Field data entry and regional monitoring.
7. **ANC Tracking**: Antenatal Care visit scheduling and missed appointment detection.
8. **Smart Reminders**: Automated medicine and hydration alerts.
9. **AI Insights & Reporting**: Weekly health summaries and downloadable reports.
10. **Data Security**: AES-256 encrypted storage and MongoDB cloud sync.
11. **RBAC Security**: JWT-based role-restricted access control.
12. **System Admin**: Global statistics and system health monitoring.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS 4.0, Framer Motion, Dexie.js (IndexedDB).
- **Backend**: FastAPI (Python), Scikit-learn, Google Gemini 1.5 Flash.
- **Database**: MongoDB Atlas (Cloud), SQLite/IndexedDB (Local).
- **Security**: AES-256, JWT.

## 🏁 Quick Start
1. **Backend**: `cd backend && pip install -r requirements.txt && python -m uvicorn app.main:app --reload`
2. **Frontend**: `cd frontend && npm install && npm run dev`

---
*Built for Hackathon: AI for Social Impact*
