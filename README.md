# Real-Time AI Football Analytics & B2B Data Platform

A cloud-native, hyper-scalable predictive telemetry platform built for the Microsoft Foundry Showcase. This platform ingests streaming football match events in real time, leverages custom machine learning engines (XGBoost) to evaluate live momentum shifts, and utilizes Generative AI to automate localized match reporting and tactical insights for global sports networks.

## 🏗️ System Architecture
[ Live Match Event Source ]
│
▼
[ Azure Event Hubs / Kafka API ]
│
▼
┌──────────────────────────────────────────────────────────────┐
│                Azure Container Apps (Microservices)          │
├──────────────────────────────┬───────────────────────────────┤
│  [ Ingestion / ML Engine ]   │   [ Azure OpenAI Automator ]  │
└──────────────┬───────────────┴───────────────┬───────────────┘
│                               │
▼                               ▼
[ Azure Cache for Redis ]              [ Microsoft Fabric OneLake ]
(Hot Memory Real-Time API)            (DirectLake Delta Tables)
│                               │
▼                               ▼
[ B2B Client Portals ]           [ Live Power BI Dashboards ]

## 🚀 Key Features & Submission Alignment

*   **Real-Time Match Analysis:** Employs an edge-deployed **XGBoost Classifier** evaluating rolling time-series shifts in Expected Goals (xG), match time, goal margins, and red card distributions under 10ms.
*   **Generative AI Sports Journalism:** Integrates **Azure OpenAI Service (GPT-4o)** to transform complex telemetry data vectors into structured post-match news stories and recaps automatically.
*   **Global Localization:** Uses low-temperature **Azure OpenAI Agent chains** to translate and dynamically localize complex tactical insights natively into multiple languages for fans around the world.
*   **Enterprise-Scale Data Layer:** Leverages **Microsoft Fabric (OneLake)** with Delta Lake parquet formatting to feed interactive dashboards via **DirectLake Mode**, bypassing traditional query bottlenecks.
*   **Continuous Deployment:** Built using standard **GitHub Actions** workflows compiling container footprints to Azure Container Registry and shipping dynamically to Azure Container Apps.

## 🛠️ Technology Stack
*   **Frontend Dashboard:** React, Tailwind CSS, Lucide Icons, WebSockets
*   **Cloud Infrastructure:** Azure Event Hubs, Azure Container Apps, Azure Cache for Redis
*   **Analytics & Data Warehouse:** Microsoft Fabric, Synapse SQL, Power BI
*   **Artificial Intelligence:** Azure OpenAI Service (GPT-4o), Scikit-Learn, XGBoost
*   **DevOps & Tools:** GitHub Actions, Docker, Python 3.11, GitHub Copilot

## 📦 Project Directory Structure
```text
├── .github/
│   └── workflows/
│       └── azure-deploy.yml     # GitHub Actions CI/CD pipeline
├── Dockerfile                   # Portability blueprint for Azure Container Apps
├── README.md                    # Core documentation and system overview
├── fabric_schema.sql            # Star schema definitions for Fabric Lakehouse
├── requirements.txt             # Manifest of project dependencies
├── test_hub_stream.py           # Production-ready streaming match simulation
└── train_model.py               # ML processing script producing our model file
```

## ⚙️ Local Development Setup

1. **Clone the repository and enter the directory:**
   ```bash
   git clone <your-repo-url>
   cd football-ai-platform
   ```

2. **Initialize and activate your virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the streaming test simulation:**
   ```bash
   # Set your Azure credentials first
   export AZURE_EVENTHUB_CONNECTION_STR="your_connection_string"
   export AZURE_EVENTHUB_NAME="your_event_hub_name"
   python test_hub_stream.py
   ```