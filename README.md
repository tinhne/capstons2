# Capstone 2 - Medical Chatbot & Disease Prediction System

🏥 **AI-Powered Medical Chatbot and Disease Prediction Healthcare Application**

An integrated healthcare application featuring intelligent chatbot, medical consultation support, and disease prediction using Machine Learning.

---

## 📌 Project Overview

The system consists of 3 main components:

- **Frontend**: React + TypeScript - User interface with chatbot
- **Backend**: Spring Boot - Data management API and business logic
- **FastAPI**: Python ML Service - Disease prediction and symptom analysis

## 🛠️ Technology Stack

### Frontend

- ⚛️ **React 18** + **TypeScript**: Modern UI framework
- 🎨 **Tailwind CSS**: Responsive UI design
- ⚡ **Vite**: Fast build tool
- 📦 **Redux Toolkit**: State management
- 🔧 **Axios**: HTTP client
- 🌐 **WebSocket**: Real-time chat

### Backend

- ☕ **Spring Boot 3.4.4**: Java web framework
- 🔐 **Spring Security**: JWT authentication
- 🗄️ **MySQL**: Primary database
- 📊 **MongoDB**: Chat history storage
- 🔌 **WebSocket**: Real-time communication
- 📦 **Maven**: Dependency management

### ML Service (FastAPI)

- 🐍 **FastAPI**: Python web framework
- 🤖 **XGBoost**: Machine learning model
- 📊 **Scikit-learn**: ML utilities
- 📈 **Pandas**: Data processing
- 🔢 **NumPy**: Numerical computing
- 🧠 **Google Gemini API**: AI integration

---

## 🚀 System Requirements

- **Node.js** v22.14.0+ and **npm** v10.9.2+
- **Java 17** or higher
- **Maven 3.6+**
- **Python 3.8+**
- **MySQL 8.0+**
- **MongoDB** (for chat history)

---

## ⚙️ Installation & Setup

### 1. 🎨 Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Environment Configuration (.env):**

```env
API_BACKEND=http://localhost:8080
VITE_BACKEND_URL=http://localhost:8080
VITE_APP_ENV=development
```

**Run Development Server:**

```bash
npm run dev
```

**Available Scripts:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint code check
- `npm run format` - Format code with Prettier

### 2. ☕ Backend Setup

```bash
cd backend

# Build project
./mvnw clean install

# Run application
./mvnw spring-boot:run
```

**Environment Variables Configuration:**

```env
# Database
DB_URL=
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT
JWT_SIGNER_KEY=your_jwt_secret_key
JWT_VALID_DURATION=86400

# AI Integration
GEMINI_API_KEY=your_gemini_api_key
```

### 3. 🐍 FastAPI ML Service Setup

```bash
cd FastApi

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run service
python predict2.py
```

**Main ML Modules:**

- [`generate_data.py`](FastApi/generate_data.py) - Generate medical simulation data
- [`predict2.py`](FastApi/predict2.py) - Main disease prediction service
- [`association_rules.py`](FastApi/association_rules.py) - Medical association rules
- [`suggest_symptoms.py`](FastApi/suggest_symptoms.py) - Symptom suggestions

---

## 🏗️ Project Structure

```
capstons2/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/ui/       # UI components
│   │   ├── features/           # Feature modules
│   │   │   ├── admin/          # Admin management
│   │   │   ├── auth/           # Authentication
│   │   │   ├── chat/           # Chatbot
│   │   │   ├── disease/        # Disease information
│   │   │   ├── doctor/         # Doctor features
│   │   │   └── users/          # User management
│   │   ├── hooks/              # Custom hooks
│   │   ├── redux/              # State management
│   │   ├── routes/             # Routing
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utilities
│   └── package.json
├── backend/                     # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/prediction/backend/
│   │       ├── config/         # Configuration
│   │       ├── controllers/    # REST Controllers
│   │       ├── models/         # JPA Entities
│   │       ├── repositories/   # Data repositories
│   │       └── services/       # Business logic
│   └── pom.xml
└── FastApi/                     # ML Service
    ├── predict2.py             # Main prediction API
    ├── generate_data.py        # Data generation
    ├── model3/                 # ML models
    └── requirements.txt
```

---

## 🔐 Authentication System

### Default Accounts

```
Admin:  admin@gmail.com / admin
Doctor: doctor@gmail.com / doctor
Bot:    bot@system.local / 222
```

### Roles & Permissions

- **ADMIN**: Full system access
- **DOCTOR**: Disease diagnosis, view statistics
- **USER**: Chat with bot, send diagnosis requests
- **BOT**: Automated bot account

---

## 📚 API Endpoints

### Authentication

```
POST /api/auth/login           # User login
POST /api/auth/refresh-token   # Refresh token
POST /api/auth/logout          # User logout
```

### User Management

```
GET  /api/users               # List users
GET  /api/users/me            # Current user info
POST /api/users               # Create user
PUT  /api/users/{id}          # Update user
```

### Chat & AI Bot

```
POST /api/chat/bot/message    # Chat with AI
POST /api/chat/start          # Start conversation
GET  /api/chat/conversations  # List conversations
```

### Medical Diagnosis

```
POST /api/diagnose            # Send diagnosis request
PUT  /api/diagnose_disease    # Doctor diagnosis
GET  /api/diagnose/{doctorId} # Doctor's cases
```

### Disease Management

```
GET  /api/diseases            # List diseases
GET  /api/diseases/{id}       # Disease details
POST /api/diseases            # Add new disease
```

### Statistics

```
GET /api/chart-data           # Chart data
GET /api/stats/disease-by-season  # Seasonal statistics
GET /api/stats/gender         # Gender statistics
```

---

## 🔌 WebSocket Real-time Chat

### Connection Setup

```javascript
const socket = new SockJS("/ws");
const stompClient = Stomp.over(socket);

// Send message
stompClient.send("/app/chat.send", {}, JSON.stringify(message));

// Receive messages
stompClient.subscribe("/topic/conversations/{conversationId}", callback);
```

### Endpoints

- **Connect**: `/ws` (with SockJS fallback)
- **Send**: `/app/chat.send`
- **Subscribe**: `/topic/conversations/{conversationId}`

---

## 🤖 AI Integration

### Google Gemini API

- **Model**: gemini-1.5-flash
- **Features**:
  - Symptom analysis
  - Preliminary diagnosis suggestions
  - Severity assessment
  - Doctor consultation recommendations

### ML Models

- **Disease Prediction**: Predict diseases from symptoms
- **Risk Assessment**: Evaluate risk factors
- **Symptom Analysis**: Analyze symptom correlations

---

## 🚀 Running the Full System

1. **Start Backend:**

   ```bash
   cd backend && ./mvnw spring-boot:run
   ```

2. **Start ML Service:**

   ```bash
   cd FastApi && source .venv/bin/activate && python predict2.py
   ```

3. **Start Frontend:**

   ```bash
   cd frontend && npm run dev
   ```

4. **Access Applications:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080`
   - FastAPI Docs: `http://localhost:8000/docs`

---

## 🧪 Key Features

- 💬 **Intelligent Chatbot**: AI-powered medical consultation
- 🔍 **Disease Prediction**: ML model for symptom analysis
- 👨‍⚕️ **Doctor System**: Professional diagnosis and consultation
- 📊 **Statistics Dashboard**: Medical data analytics
- 🔔 **Real-time Notifications**: WebSocket notifications
- 📱 **Responsive Design**: Mobile/desktop compatibility
- 🔐 **JWT Security**: Authentication and authorization

---

## 🔄 System Workflow

### Disease Diagnosis Process

1. User chats with AI bot about symptoms
2. AI analyzes and provides preliminary suggestions
3. If needed, creates request for doctor
4. Doctor receives notification and provides diagnosis
5. Results sent back to user

### Real-time Chat Flow

1. Client connects via WebSocket
2. Joins conversation
3. Sends/receives real-time messages
4. Stores chat history

---

## 🛠️ Development

### Code Standards

- **Frontend**: ESLint + Prettier
- **Backend**: Java conventions
- **ML Service**: PEP 8 Python style

### Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && ./mvnw test

# ML service tests
cd FastApi && python -m pytest
```

---

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && ./mvnw clean package -Dmaven.test.skip=true

# ML Service
cd FastApi && pip freeze > requirements.txt
```

### Docker (Optional)

```dockerfile
# Backend
FROM openjdk:17-jdk-slim
COPY target/backend-1.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

---

## 🔧 Troubleshooting

**Database connection failed:**

```bash
# Check MySQL service
sudo systemctl status mysql
```

**JWT Token expired:**

```bash
# Use refresh token
POST /api/auth/refresh-token
```

**WebSocket connection failed:**

```bash
# Check CORS config and /ws endpoint
```

---

## 📄 License

Project developed for educational purposes - Capstone Project.

## 👥 Team

Developed by Capstone 2 Team - 2024.

---

**Version**: 1.0.0  
**Last Updated**: 2024-12-27  
**Documentation**: See API docs at `/swagger-ui.html`
