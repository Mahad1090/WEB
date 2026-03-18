# React Router Application

A single-page application (SPA) built with React and React Router, featuring client-side routing and a controlled contact form.

## Project Structure

```
Task 4/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/
│   │   ├── Navigation.jsx   # Navigation bar with links
│   │   ├── Home.jsx         # Home page component
│   │   ├── About.jsx        # About page component
│   │   └── Contact.jsx      # Contact form component
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # React entry point
│   └── style.css            # Global styles
├── package.json             # Project dependencies
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

## Features

✅ **Client-Side Routing** - Navigate between pages without page reloads using React Router  
✅ **Three Main Pages:**
- **Home** - Welcome page with introduction
- **About** - Information about the application and its features
- **Contact** - Form for user inquiries

✅ **Controlled Form Component** - Contact form with:
- Name input field
- Email input field  
- Message textarea field
- All fields connected to component state using `useState`
- onChange handlers for real-time input updates
- Form submission handler that prevents default behavior
- Console logging of form data
- Automatic form clearing after submission

✅ **Navigation Bar** - Persistent navigation menu for switching routes without page reload

## Installation

1. Navigate to the Task 4 directory:
```bash
cd "c:\Users\HP\Desktop\WEB\Task 4"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The optimized build will be generated in the `dist/` directory.

## Technologies Used

- **React** 18.x - UI library
- **React Router DOM** 6.x - Client-side routing
- **Vite** - Fast build tool and dev server
- **CSS3** - Styling with animations and gradients

## Form Submission Behavior

When the contact form is submitted:
1. Default form submission is prevented with `e.preventDefault()`
2. Form data is logged to the browser console
3. An alert message confirms the submission
4. All form fields are automatically cleared
5. User can immediately enter another message if desired

## Component Details

### Home Component
Simple welcome page introducing the application and its routing capabilities.

### About Component
Provides information about the application, key features, and technologies used.

### Contact Component
Features a controlled form using React hooks:
- Uses `useState` to manage form state
- Individual onChange handlers for each field
- Form validation (required fields)
- Professional error handling and user feedback

### Navigation Component
Persistent navigation bar with links to all three pages that update the URL without reloading the page.

## Key React Concepts Demonstrated

- **React Router** - BrowserRouter, Routes, Route, Link components
- **React Hooks** - useState for form state management
- **Controlled Components** - Form inputs linked to component state
- **Event Handling** - onChange and onSubmit handlers
- **Component Composition** - Modular component structure

## Browser Compatibility

Works on all modern browsers that support ES6+ and modern React features.
