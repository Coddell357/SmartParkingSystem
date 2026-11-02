# 🅿️ Parkitects — Smart IoT Parking Ecosystem

> **An IoT-enabled smart parking ecosystem designed to simplify campus parking, improve parking visibility, assist users in finding their vehicles and enable security personnel to manage parking violations.**

---

## 📖 Table of Contents

* [📌 About the Project](#-about-the-project)
* [🎯 Project Objectives](#-project-objectives)
* [✨ Key Features](#-key-features)
* [🏗️ System Architecture](#️-system-architecture)
* [🛠️ Technology Stack](#️-technology-stack)
* [📱 Mobile Application](#-mobile-application)
* [🖥️ Security Web Application](#️-security-web-application)
* [⚙️ Backend API](#️-backend-api)
* [🗄️ Database](#️-database)
* [🔥 Firebase Integration](#-firebase-integration)
* [📡 IoT and BLE Integration](#-iot-and-ble-integration)
* [🔔 Notification System](#-notification-system)
* [🚗 Find My Car](#-find-my-car)
* [🐳 Docker](#-docker)
* [📂 Project Structure](#-project-structure)
* [🚀 Getting Started](#-getting-started)
* [📱 Running the Mobile Application](#-running-the-mobile-application)
* [🌐 Running the Web Application](#-running-the-web-application)
* [🔧 Environment Configuration](#-environment-configuration)
* [🧪 Testing](#-testing)
* [🔐 Security Considerations](#-security-considerations)
* [👥 Development Workflow](#-development-workflow)
* [📚 References](#-references)

---

# 📌 About the Project

**Parkitects** is a smart parking ecosystem developed as part of the team's Work Integrated Learning (WIL) project.

The system combines **mobile technology, IoT/BLE communication, cloud services, RESTful APIs, a relational database and a security management web application** to provide a connected parking experience.

Find our Demo Video here:
https://youtu.be/w3g6sElP0p0?si=XZcfjseTuo_iVkfB

The system is designed around two main user experiences:

### 👤 Parking Users

Users interact with the Parkitects mobile application to:

* View live parking availability.
* Find available parking.
* Detect nearby parking infrastructure using Bluetooth Low Energy (BLE).
* Identify and claim their occupied parking bay.
* Start a parking session.
* Save their parking location.
* Find their vehicle again later.
* Receive parking-related notifications.
* Manage their account and notification preferences.

### 🛡️ Security Personnel

Security personnel interact with the web application to:

* Monitor and manage parking-related information.
* Issue parking tickets.
* Update ticket statuses.
* Manage parking violations.
* Trigger appropriate user notifications when ticket statuses change.

The system is supported by a **.NET 10 REST API**, **SQL Server**, **Firebase Authentication**, Firebase-based parking functionality and a Dockerised deployment environment.

---

# 🎯 Project Objectives

The main objectives of Parkitects are to:

* 🅿️ Improve the campus parking experience.
* 📍 Provide users with useful information about available parking.
* 📡 Use IoT/BLE technology to assist with parking-bay identification.
* 🚗 Help users remember where they parked.
* 🔔 Provide timely parking and ticket notifications.
* 🛡️ Give security personnel a centralised system for managing parking violations.
* 🔐 Provide authenticated and user-specific functionality.
* 🔄 Allow the mobile application and web application to communicate through a central backend API.
* 🗄️ Persist application data using SQL Server.
* ☁️ Use Firebase services where appropriate.
* 🐳 Provide a reproducible development environment using Docker.

---

# ✨ Key Features

## 🅿️ Live Parking Availability

The mobile application retrieves parking information from the backend and displays the current number of available parking bays.

The Home screen periodically refreshes the parking information so that users can see updated availability.

A warning is displayed when parking availability becomes limited.

> ⚠️ The application currently treats **15 or fewer available bays** as limited parking availability.

---

## 📡 BLE Parking-Bay Detection

The application uses Bluetooth Low Energy functionality to detect nearby parking infrastructure.

The parking workflow includes:

1. Requesting Bluetooth permissions.
2. Checking whether Bluetooth is enabled.
3. Attempting to enable Bluetooth when required.
4. Scanning for nearby parking nodes.
5. Identifying the nearest node.
6. Retrieving bays associated with that node.
7. Identifying an occupied but unclaimed bay.
8. Allowing the user to select their bay.
9. Claiming the bay using the authenticated user's Firebase UID.
10. Starting a parking session.

---

## 🚗 Find My Car

Parkitects allows users to save the location associated with their active parking session.

The mobile application retrieves location information from the backend and stores relevant values locally, including:

* Latitude
* Longitude
* Formatted location

The mobile application uses **AsyncStorage** to retain these values locally.

---

## 🔔 Configurable Notifications

Users can control their notification preferences.

The system supports:

* 📧 Email notifications
* 📱 Push notifications

Users can independently enable or disable these notification types.

The ticket notification system follows the user's preferences.

## 🎫 Parking Ticket Management

Security personnel can issue parking tickets and update ticket statuses.

The notification system responds to relevant status transitions.

For a newly issued ticket, the important transition is:

Pending > Notified

When this occurs, the backend checks the user's notification preferences before sending notifications.

The system also supports the:

Awaiting review > Notified

scenario for cases where a parking violation has not been properly resolved.

---

## 👤 User Profiles

Authenticated users have a profile connected to their Firebase account.

The Firebase UID is used to associate the authenticated Firebase account with the corresponding user record in the backend database.

The mobile application can retrieve the user's profile information through the backend API.

The user's name is also used to dynamically generate the initials displayed in the Home screen profile avatar.

---

## ⚙️ User Settings

The application provides user-specific settings, including:

* 📍 Location
* 📧 Email notifications
* 🔔 Push notifications
* 🔤 Text size
* 🎨 Theme
* ♿ Reduced motion
* 🔊 Screen reader support
* 📳 Haptic feedback

These settings are stored and retrieved through the backend.

---

# 🏗️ System Architecture

Parkitects follows a multi-component architecture consisting of a mobile application, web application, backend API, database, Firebase services, and IoT/BLE components.

<img width="637" height="332" alt="image" src="https://github.com/user-attachments/assets/7f9aadaf-0ade-47de-9319-0d3edd0e3ab2" />
<img width="648" height="247" alt="image" src="https://github.com/user-attachments/assets/43825761-f274-41dd-a459-82abe62f673d" />

The backend acts as the central application layer connecting the mobile application, web application, and persistent data.

---

# 🛠️ Technology Stack

## 📱 Mobile Technology & Purpose

- React Native: Mobile application framework
- Expo: Development and native tooling
- Expo Router: Application navigation
- TypeScript: Type-safe mobile development 
- Axios: HTTP communication
- Firebase Authentication: User authentication 
- AsyncStorage: Local mobile storage
- `react-native-ble-plx`: Bluetooth Low Energy functionality
- Expo Sensors: Sensor functionality

---

## ⚙️ Backend Technology & Purpose

- C#: Backend programming language
- .NET 10: Backend framework/runtime 
- ASP.NET Core: REST API for Communication between applications
- Entity Framework Core: Database access
- Azure SQL Database: Online data storage

---

## 🖥️ Web Technology & Purpose

- React: Frontend framework 
- Vite: Frontend build/development tooling
- Node.js: JavaScript runtime/build environment
- Nginx: Web application serving 

---

## 🐳 Infrastructure Technology & Purpose

- Docker: Containerisation 
- Docker Compose: Multi-container orchestration  
- Azure SQL Server: Scalability and Security  
- Firebase: Authentication and selected cloud functionality 

---

# 📱 Mobile Application

The mobile application is located in:

`mobileApp/`

It is built using React Native with Expo and Expo Router.

The application contains functionality for:

* 🔐 Authentication
* 🏠 Home/dashboard
* 🅿️ Parking availability
* 📡 BLE parking detection
* 🚗 Find My Car
* 🔔 Notifications
* ⚙️ Settings
* 👤 User profile
* 📍 Parking sessions

---

## 🏠 Home Screen

The authenticated Home screen provides:

* Current available parking-bay count.
* Live parking status.
* Low-parking warning.
* Notification access.
* User profile access.
* Parking location functionality.
* BLE parking-bay detection.
* Search functionality.

The parking map is retrieved from:

`GET /api/Parking/map`

The application refreshes this information periodically.

---

# 🖥️ Security Web Application

The security web application is located under:

SecurityWebapp/ > securityWeb/ > frontend/

It provides the web-based interface used by security personnel.

The web application communicates with the .NET backend rather than directly accessing the SQL Server database.

This keeps the database behind the backend API and provides a central location for business logic and validation.

---

# ⚙️ Backend API

The backend is located in:

```text
backend2/
```

It is an ASP.NET Core application running on .NET 10.

The API contains controllers for functionality such as:

* 👤 User management
* ⚙️ User settings
* 🎫 Parking tickets
* 🅿️ Parking information
* 🚗 Find My Car
* 🔔 Notifications
* 📱 Push tokens
* Other application functionality

The backend uses Entity Framework Core to communicate with SQL Server.

---

# 🗄️ Database

Parkitects uses **Microsoft Azure SQL Server** for automated operations and elastic scaling.

The database setup scripts are located under:

```text
iot_Parkitects/backend2/Data/SQl SCRIPT.sql
```

The backend uses an `ApplicationDbContext` to expose application entities through Entity Framework Core.

Examples include:

```csharp
DbSet<Settings>
DbSet<Ticket>
DbSet<PushToken>
DbSet<Notifications>
```

The database stores application-specific information such as users, settings, tickets, and notification-related data.

---

# 🔥 Firebase Integration

Firebase is used primarily for authentication and selected parking functionality.

## 🔐 Firebase Authentication

Users authenticate through Firebase Authentication.

The authenticated Firebase user has a unique:

```text
Firebase UID
```

The UID is used to associate the Firebase account with the corresponding backend user.

The mobile application accesses the currently authenticated user using:

```tsx
auth.currentUser
```

and can obtain:

```tsx
auth.currentUser.uid
```

---

## 🔗 User Synchronisation

The backend provides functionality for synchronising authenticated users with the application's database.

The Firebase UID provides the link between:

Firebase Account <> Backend User <> SQL Server

This allows the system to maintain application-specific user information while using Firebase for authentication.

---

# 📡 IoT and BLE Integration

IoT functionality is an important part of the Parkitects ecosystem.

The mobile application communicates with nearby BLE parking infrastructure.

The BLE workflow is implemented through utilities within:

```text
mobileApp/utils/
```

The application uses:

```text
react-native-ble-plx
```

to access native Bluetooth functionality.

Because BLE requires native functionality, the application uses an Expo development build rather than relying solely on Expo Go.

---

# 🔔 Notification System

Parkitects supports both push and email notifications.

The notification process is controlled by the user's settings.

For example:

```text
Ticket status changes
        │
        ▼
Pending → Notified
        │
        ▼
Retrieve user settings
        │
        ├───────────────┐
        ▼               ▼
 Email enabled?     Push enabled?
        │               │
       YES             YES
        │               │
        ▼               ▼
 Send email        Send push
```

If both notification methods are disabled, no notification is sent.

---

## 📧 Email Notifications

When email notifications are enabled, the backend retrieves the user's email address and sends a ticket-related email.

The email contains relevant ticket information such as:

* Ticket number
* Parking bay
* Violation reason
* Additional instructions

---

## 📱 Push Notifications

When push notifications are enabled, the backend uses the application's push notification service to notify the relevant authenticated user.

The notification can contain information such as:

```text
Ticket #123
Parking ticket issued
```

---

# 🚗 Find My Car

The Find My Car functionality is designed to help users remember where they parked.

After a parking session is started, the application retrieves the active parking-bay location from:

```text
GET /api/FindMyCar/active-bay
```

The response contains information such as:

```text
latitude
longitude
formattedLocation
```

The mobile application stores these values using AsyncStorage.

Example storage keys:

```text
parkedLat
parkedLon
parkedLabel
```

---

# 🐳 Docker

The project uses Docker Compose to run the main application services together.

The primary services are:

```text
backend2-service
frontend-service
```

All services communicate through:

```text
parkitects-network
```

### Service Overview & Purpose

`backend2-service`: .NET 10 backend API      
`frontend-service`: Security web application

---

# 📂 Project Structure

A simplified project structure is:

```text
iot_Parkitects/
│
├── 📁 backend2/
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Services/
│   ├── wwwroot/
│   ├── Dockerfile
│   └── ...
│
├── 📁 mobileApp/
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── utils/
│   ├── assets/
│   ├── package.json
│   ├── app.json
│   └── ...
│
├── 📁 SecurityWebapp/
│   └── securityWeb/
│       └── frontend/
│           ├── src/
│           ├── public/
│           ├── package.json
│           └── ...
│
├── 🐳 .github/workflows/
│   └── docker-image.yml
│
├── 🐳 docker-compose.yml
├── 🚫 .dockerignore
└── 📄 README.md
```

---

# 🚀 Getting Started

## 📋 Prerequisites

Before running Parkitects locally, ensure the following are installed:

* 🐳 Docker Desktop
* 🟢 Node.js
* 📱 Android Studio / Android development environment
* ☕ Java/JDK required by the Android development environment
* 🔥 Firebase project configuration
* ⚙️ .NET 10 SDK
* 🐙 Git

For mobile development, a suitable Android device or emulator is also required.

---

# 🐳 Running the Full System with Docker

From the project root:

```powershell
cd "C:\Users\Documents\insy7315-2026-wil-coddell357\iot_Parkitects"
```

Then run:

```powershell
docker compose up --build -d
```

This builds and starts the Docker services.

The main services are:

```text
⚙️ .NET Backend
🖥️ Security Web Application
```

---

# ⚙️ Backend

If running the backend independently during development:

```powershell
cd backend2
dotnet run
```

The backend listens on the hosted API address.

When running inside Docker, the application listens internally on:

```text
http://0.0.0.0:5000
```

---

# 🌐 Security Web Application

The security web application's frontend is located at:

```text
SecurityWebapp/securityWeb/frontend
```

During local development, install the required packages and start the frontend using the project's configured npm scripts.

When running through Docker, the frontend is exposed through the configured Docker port.

The Docker-hosted frontend is available at:

```text
http://localhost:8081
```

---

# 📱 Running the Mobile Application

Navigate to:

```powershell
cd mobileApp
```

Install dependencies:

```powershell
npm install
```

The mobile application uses an Expo development build because native functionality such as BLE requires native modules.

Start the development server using the project's Expo configuration.

For native development builds, ensure that the development build is installed on the Android device/emulator before connecting to the Metro development server.

---

# 🔧 Environment Configuration

The mobile application uses environment variables for backend configuration.

The primary API configuration is accessed through:

```text
EXPO_PUBLIC_API_URL
```

For example, application code retrieves the API URL using:

```tsx
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

This prevents the backend address from being hard-coded throughout the application.

The correct API address must be configured according to the environment in which the application is running if locally otherwise the API address has been hosted on azure web app service and deployed successfully.

---

# 🧪 Testing

Testing is performed at multiple levels.

## 🔹 TypeScript Validation

From the mobile application directory:

```powershell
npx tsc --noEmit
```

This checks the mobile application's TypeScript code without producing compiled output.

---

## 🔹 Expo Project Validation

Expo Doctor can be used to validate the Expo project's dependencies and configuration:

```powershell
npx expo-doctor
```

The project has previously achieved:

```text
18/18 checks passed
No issues detected
```

---

## 🔹 Notification Testing

Notification behaviour can be tested through the actual mobile and security applications.

### Email notification test

1. Log into the mobile application.
2. Open Settings.
3. Open notification settings.
4. Enable email notifications.
5. Disable push notifications.
6. Have security issue a new parking ticket.
7. Change the ticket from `Pending` to `Notified`.
8. Check the user's email inbox.

Expected result:

```text
📧 Email received
📱 No push notification
```

### No-notification test

1. Disable email notifications.
2. Disable push notifications.
3. Create a new parking ticket.
4. Change it from `Pending` to `Notified`.
5. Verify that no notification is received.

Expected result:

```text
📧 No email
📱 No push notification
```

A new ticket should be used for each test because the notification logic is triggered by the relevant ticket-status transition.

---

# 🔐 Security Considerations

Parkitects uses several mechanisms to protect application functionality and user information.

### 🔑 Authentication

Firebase Authentication is used to authenticate users.

### 🆔 Firebase UID

The Firebase UID is used to associate authenticated users with their backend records.

### 🗄️ Database Isolation

The mobile and web applications communicate with the backend API rather than directly connecting to SQL Server.

### 🌐 API Layer

Business logic is handled by the backend API, providing a controlled interface between clients and persistent data.

### 🔒 User-Specific Settings

Notification preferences and other settings are associated with individual users.

### 📱 Native Permissions

The mobile application requests the permissions required for Bluetooth functionality rather than assuming access.

---

# 👥 Development Workflow

The project is developed collaboratively using Git and GitHub.

The team's workflow includes:

* Creating and maintaining a shared Git repository.
* Cloning the repository for development.
* Installing the required project dependencies.
* Connecting Firebase to the relevant applications.
* Developing features independently.
* Integrating changes through Git.
* Testing features locally.
* Using Docker for consistent backend/web/database environments.
* Recording team meetings and development activities as part of the WIL process.

The team also uses collaborative activities to strengthen communication and teamwork.

As part of the School of Computer Science Day on **19 August**, the team participated in an NFC tag scavenger hunt as a team-building activity and achieved **first place**.

---

# 🧩 Major System Components & Responsibility   

📱 Mobile Application: User-facing parking experience
🛡️ Security Web Application: Security and parking-violation management
⚙️ .NET Backend: API and business logic                            
🗄️ SQL Server: Persistent application data                       
🔥 Firebase: Authentication and selected parking functionality 
📡 BLE: Nearby parking-node detection                     
🔔 Notification Services: Email and push notifications                      
🐳 Docker: Application containerisation               

---

# 🔄 Example End-to-End Parking Flow

The following demonstrates how multiple components work together:

1. 👤 User logs into Parkitects >

2. 🔐 Firebase authenticates the user >

3. 🏠 User opens the Home screen >

4. 🅿️ Application retrieves live parking data >

5. 📡 User chooses "Where did you park?" >

6. 📡 BLE scans for nearby parking nodes >

7. 🅿️ Nearby bays are retrieved >

8. 👤 User selects their occupied bay >

9. 🔗 Bay is associated with the user's Firebase UID >

10. 🚗 Parking session begins >

11. 📍 Location is retrieved and stored >

12. 🏫 Security can manage parking violations >

13. 🎫 Ticket is issued >

14. 🔔 User receives notification according to settings

---

# 🏆 Project Vision

Parkitects aims to provide a connected and user-friendly parking ecosystem rather than treating parking as a simple static map of available spaces.

By combining:

📱 Mobile Technology
       +
📡 IoT / BLE
       +
🔥 Firebase
       +
⚙️ REST APIs
       +
🗄️ Azure SQL Server
       +
🛡️ Security Management
       +
🔔 Notifications

the system creates a centralised platform that supports both the **parking user** and **security personnel**.

---

# 📚 References

Material UI.2026. Material UI components. (Version 2.0) [Source code] . Available at: <https://mui.com/material-ui/all-components/ > [Accessed 12 August 2026]. 
npm. 2024. react-native-circular-progress. (Version 2.0) [Source code] Available at: <https://www.npmjs.com/package/react-native-circular-progress?activeTab=readme > [Accessed 17 August 2026].

Expo Documentation.2024.Create a project. [online]  Available at: <https://docs.expo.dev/get-started/create-a-project/ > [Accessed 17 August 2026].

Racisz, T. 2020. Creating an interactive map with React and Firebase. (Version 2.0) [Source code] .Available at: <https://medium.com/@travisracisz/creating-an-interactive-map-with-react-and-firebase-fa183cef15c9 > [Accessed 5 August 2026].
 
 realCAiN. 2024. Updated* Dashboard for sales, ect / Admin Dashboard. (Version 2.0) [Source code] Available at: < https://codepen.io/realCaiN/pen/yLdEzwv > [Accessed 16 August 2026]. 

rudderz243.2026. rudderz243/insy7314-library.  (Version 2.0) [Source code]. Available at: <https://github.com/rudderz243/insy7314-library> [Accessed 17 August 2026].
          
Vincent,M. 2016. login / sign up - React - Daily UI #001. (Version 2.0) [Source code] Available at: < https://codepen.io/matthewvincent/pen/JXOKbY > [Accessed 12 August 2026]. 

Withfra.me. 2022. Ready to Use React Native Components - WithFrame | withfra.me. (Version 2.0) [Source code] Available at:<https://withfra.me/components > [Accessed 17 August 2026].

npm. 2024. react-native-circular-progress. (Version 2.0) [Source code] Available at: <https://www.npmjs.com/package/react-native-circular-progress?activeTab=readme > [Accessed 17 August 2026].
 
Yilmaz.2018. car park. (Version 2.0) [Source code] Available at: <https://codepen.io/tenkyu/pen/zaJwaR> [Accessed 17 August 2026].



