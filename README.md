# COMP-491-24-25-Sustainability-Dashboard

## **Project Overview**
The Sustainability Dashboard is a web-based application designed to visualize and report energy data for sustainability-focused initiatives. Built using Vue.js for the frontend and Node.js with Express for the backend, it employs a microservices architecture for modularity, scalability, and flexibility. The backend integrates with PostgreSQL for structured data storage and supports multiple energy sources, such as solar, utility, and fuel cells. The platform aims to provide real-time data visualization, energy usage insights, and interactive maps for users, including administrators and the general public.

---

## **Software Requirements**

### **Backend Requirements**
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Express.js](https://expressjs.com/) (v4 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [PM2](https://pm2.keymetrics.io/) (optional, for process management)

### **Frontend Requirements**
- [Vue.js](https://vuejs.org/) (v3 or higher)
- [Vite](https://vitejs.dev/) (v4 or higher)
  
### **Package Manager**
- [npm](https://www.npmjs.com/) (bundled with Node.js) or [yarn](https://yarnpkg.com/) (optional)

### **Development Tools**
- A modern code editor like [Visual Studio Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) (optional, for API testing) 

---

## **Environment Configuration**
Ensure you have the following environment variables configured:

1. **PostgreSQL Database Connection:**
   - `DB_USER` - PostgreSQL username
   - `DB_PASSWORD` - PostgreSQL password
   - `DB_HOST` - PostgreSQL host
   - `DB_PORT` - PostgreSQL port (default: 5434)
   - `DB_NAME` - PostgreSQL database name
     
  2. **Backend API URL:**
   - `API_URL` - The base URL for the backend API (default: `http://localhost:3000`)

---

## **Key Features**

- Calpine Energy Service: Fetches and processes electricity usage for on-campus locations.
- SDG&E Energy Service: Handles off-campus electricity data and sub-meter tracking.
- AE Power Solar Service: Monitors solar panel energy generation metrics.
- Bloom Energy Fuel Cell Service: Tracks fuel cell energy creation and efficiency.

# Updated Instructions

## **How to Run**
1. Clone the repository.
2. Install dependencies for the entire project:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm start
   ```

4. Start the frontend and create a local webpage URL:

   ```bash
   npm run dev
   ```

5. Run tests:

   ```bash
   npm test
   ```

6. Run the linter:

   ```bash
   npm run lint
   

