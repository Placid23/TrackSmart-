# TrackSmart+ Architecture

This document outlines the layered architecture of the TrackSmart+ application. The app is designed to be a fully client-side solution, prioritizing user privacy and a modern, scalable tech stack.

## 1. Presentation Layer

This layer is responsible for all user-facing interactions and visual elements of the application.

### Technologies Used

*   **Next.js (v15):** Provides routing (App Router), optimized rendering, and performance enhancements.
*   **React (v19):** Enables a component-based UI structure.
*   **TypeScript:** Ensures type safety and reduces runtime errors.
*   **Tailwind CSS:** Handles all styling using utility-first classes.
*   **ShadCN UI:** Supplies accessible and reusable UI components such as dialogs, cards, buttons, and sheets.
*   **Lucide React:** Provides clean and consistent icons across the interface.
*   **next-themes:** Enables light and dark mode theme switching.

### Responsibilities

*   Displays the calendar dashboard, order views, cart panel, and profile pages.
*   Provides real-time visual feedback on spending behavior.
*   Ensures accessibility, responsiveness, and a polished UI experience.

## 2. Interaction & State Management Layer

This layer manages how data flows between components and how the application responds to user actions.

### Technologies Used

*   React Hooks (`useState`, `useEffect`)
*   React Context API

### Responsibilities

*   Manages shared application state such as:
    *   User profile
    *   Shopping cart contents
    *   Budget thresholds
    *   Transaction history
*   Ensures consistent data across all components without unnecessary re-rendering.

## 3. Automated Expense Logging Module

This module replaces manual expense entry and is tightly integrated with the ordering workflow.

### Functionality

*   Automatically logs expenses when a student places an order through the app.
*   Captures:
    *   Product name
    *   Quantity
    *   Amount spent
    *   Category
    *   Timestamp
*   Eliminates manual input and reduces data inconsistency.

### Supporting Tools

*   **React Hook Form:** Handles structured form interactions (e.g., profile creation).
*   **Zod:** Validates user input and ensures data correctness before storage.

## 4. Data Storage & Persistence Layer

This layer handles long-term data retention directly on the user’s device.

### Technology Used

*   Browser Local Storage

### Responsibilities

*   Stores:
    *   User profile data
    *   Order and transaction history
    *   Budget limits
    *   Cart state
*   Persists data across sessions without requiring a backend server.
*   Enables offline access and fast retrieval.

The application accesses this data through controlled TypeScript-based utility functions, ensuring safe and structured reads and writes.

## 5. Visualization & Analytics Layer

This layer transforms raw expense data into meaningful insights.

### Technologies Used

*   **Recharts:** Generates interactive charts for spending trends.
*   **Tailwind CSS Animations**
*   **Framer Motion (via ShadCN UI)**

### Responsibilities

*   Displays:
    *   Daily, weekly, and monthly spending charts.
    *   Budget comparison visuals.
*   Uses smooth animations for:
    *   Cart slide-ins
    *   Dialog pop-ups
    *   Chart transitions
*   This improves clarity, engagement, and user understanding of financial behavior.

## 6. Threshold Evaluation & Decision Logic Layer

This layer performs rule-based and ML-assisted analysis of spending data.

### Functionality

*   Compares actual spending against:
    *   Daily budgets
    *   Monthly budgets
*   Labels spending behavior as:
    *   Within budget
    *   Over budget
*   Supplies structured historical data for predictive analysis.

## 7. Decision Tree Prediction Module (ML Component)

This is the analytical intelligence layer of the system.

### Functionality

*   Uses historical expense data stored locally.
*   Applies a Decision Tree algorithm (implemented in TypeScript/JavaScript or Python if extended server-side).
*   Predicts:
    *   Likelihood of overspending.
    *   User spending discipline level.
*   Generates a spending score and short advisory feedback.

This module enables the app to move beyond tracking and into predictive financial guidance.

## Overall Architectural Advantages

*   Fully client-side and privacy-friendly
*   Modern, scalable tech stack
*   Automated expense tracking
*   Clear separation of concerns
*   ML used appropriately for prediction, not core logic
