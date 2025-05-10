# COMP-491-24-25-Sustainability-Dashboard

## **Project Overview**
The Sustainability Dashboard is a web-based application designed to visualize and report energy data for sustainability-focused initiatives. Built using Vue.js for the frontend and Node.js with Express for the backend, it employs a microservices architecture for modularity, scalability, and flexibility. The backend integrates with PostgreSQL for structured data storage and supports multiple energy sources, such as solar, utility, and fuel cells. The platform aims to provide real-time data visualization, energy usage insights, and interactive graphs for users, including administrators and the general public.

---

## **Software Requirements**

### **Backend Requirements**
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Express.js](https://expressjs.com/) (v4 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)

### **Frontend Requirements**
- [Vue.js](https://vuejs.org/) (v3 or higher)
- [Vite](https://vitejs.dev/) (v4 or higher)
  
### **Package Manager**
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### **Development Tools**
- A modern code editor like [Visual Studio Code](https://code.visualstudio.com/)
---

## **Environment Configuration**
Ensure you have the following environment variables configured:

1. **PostgreSQL Database Initialization:**
   - `POSTGRES_USER` - Sets the username for the default superuser
   - `POSTGRES_PASSWORD` - Sets the password for the superuser
   - `POSTGRES_DB` - Creates a database with this name
  
2. **PostgreSQL Database Connection:**
   - `DB_USER` - PostgreSQL username
   - `DB_PASSWORD` - PostgreSQL password
   - `DB_HOST` - PostgreSQL host
   - `DB_PORT` - PostgreSQL port (default: 5434)
   - `DB_NAME` - PostgreSQL database name

3. **JSON Web Token (JWT):**
   - `JWT_SECRET` - Secret key used to sign and verify JWTs
  
4. **Backend API URL:**
   - `VITE_API_URL` - Frontend-exposed base API URL (e.g., `http://localhost:3000`)
   - `BASE_URL` - Base URL used by backend to make internal or external API calls
   - `PORT` - Port number the backend service runs on (default: 3000)

5. **Test User Credentials (for development use):**
   - `ADMIN_USER_NAME` - Username for the seeded development test user
   - `ADMIN_USER_EMAIL` - Email address for the test user account
   - `ADMIN_USER_PASSWORD` - Password for logging into the test user account
     
6. **BloomEnergy API Integration:**
   - `TOKEN_URL` - Authentication endpoint to obtain access tokens
   - `BLOOM_SITE_ID` - Endpoint to retrieve available site identifiers
   - `BLOOM_SITE_DATA` - Endpoint to request data for a specific site
   - `BLOOM_USERNAME` - Username used for API authentication
   - `BLOOM_PASSWORD` - Password associated with the API account

---

## **Key Features**

- AE Power Solar Service: Monitors solar panel energy generation metrics.
- Bloom Energy Fuel Cell Service: Tracks fuel cell energy creation and efficiency.

# Updated Instructions

## **How to Run**
1. Clone the repository.
2. Install Docker Engine and Docker Compose v2:

   ```bash
   sudo apt-get update
   sudo apt-get install docker.io docker-compose-plugin
   ```

3. Run Docker Containers

   ```bash
   docker compose up
   ```



