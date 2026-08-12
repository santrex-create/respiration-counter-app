# SPIREX — Smart Respiration & Health Telemetry Dashboard 🫁⚡

> A real-time biomedical telemetry web platform that processes respiration metrics, accepts neural/sensor hardware uplinks, and generates AI-driven clinical health analysis.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-00E599?style=for-the-badge&logo=render&logoColor=white)](https://respiration-counter-app.onrender.com/)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js_|_TypeScript_|_Tailwind-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Google_Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](https://aistudio.google.com/)

---

## 🌟 Overview

**SPIREX (v2.5)** is a modern telemetry dashboard designed for real-time respiratory monitoring and predictive analysis. It allows users to execute manual tap counts or stream automated biometric telemetry from external hardware sensors (such as ESP32 modules). The application leverages Google Gemini AI models to analyze respiration dynamics and detect potential anomalies in real time.

---

## ✨ Key Features

- **⏱️ Dual-Mode Telemetry:** Supports manual tap-counting for instant RR (Respiration Rate) measurement alongside automated hardware uplinks.
- **🔌 Hardware Integration:** Ready to interface with ESP32 biomedical sensor nodes via REST and Secure WebSockets.
- **🧠 Generative AI Clinical Insights:** Integrated Google Gemini LLM engine to analyze respiration rates and output detailed health recommendations.
- **⚡ High-Performance Visuals:** Refactored rendering loops designed for smooth 60 FPS real-time telemetry streaming.
- **🔒 Production Security:** Strict environment variable isolation ensuring sensitive API keys are safely managed in production.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend & Framework** | Next.js (App Router), React, TypeScript |
| **Styling & UI** | Tailwind CSS, Lucide Icons |
| **AI Integration** | Google Gemini API (`@google/generative-ai`) |
| **Hardware Client** | ESP32 Microcontroller, Sensor Modules |
| **Deployment & Hosting** | Render, GitHub Actions CI/CD |

---

## 🚀 Live Demo

Access the live hosted deployment:
👉 **[https://respiration-counter-app.onrender.com/](https://respiration-counter-app.onrender.com/)**

---

## 💻 Getting Started Locally

### Prerequisites

- **Node.js** v18.x or higher
- **npm** or **yarn**
- **Google Gemini API Key** (obtainable via [Google AI Studio](https://aistudio.google.com/))

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/santrex-create/respiration-counter-app.git](https://github.com/santrex-create/respiration-counter-app.git)
   cd respiration-counter-app

```

2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here

```


4. **Run the development server:**
```bash
npm run dev

```


5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## ⚙️ Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `GEMINI_API_KEY` | Secret key for Google Gemini Generative AI endpoints | **Yes** |

---

## 🛰️ ESP32 Sensor Hardware Setup

To stream live respiration telemetry from an ESP32 microcontroller:

1. Flash your ESP32 with your sensor sampling script (e.g., piezoelectric chest strap or airflow sensor).
2. Transmit HTTP POST payloads or WebSocket packets targeting the `/api/vitals` endpoint of your deployed URL:
```json
{
  "respiration_rate": 16,
  "timestamp": "2026-08-12T10:00:00Z"
}

```



---

## 📦 Deployment

This project is configured for continuous deployment on **Render**:

* **Build Command:** `npm install && npm run build`
* **Start Command:** `npm run start`

---

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

```

```
