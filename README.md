
# Quotify


**Quotify** is a React-based web application designed to provide users with motivational and thought-provoking quotes. The platform integrates seamless user authentication and a dynamic quote recommendation system. It also includes robust admin functionalities for user and category management.

[Live Demo](https://quotify-one.vercel.app/)

## Usage
#### Clone the repository
```bash
git clone https://github.com/Dhanush-777x/quotify.git
cd quotify
```
#### Install the packages
```bash
npm install
```
#### Run the application
```bash
npm start
```

### Credentials
#### **Admin**
 - username - admin
 - password - admin
 #### **Manager**
 - username - manager
 - password - manager
 #### **User**
 - username - user
 - password - user

## Features

### User Authentication
- Secure login and logout functionality using JWT (JSON Web Token). 
- Role-based access control (Admin, Manager and User) to define user permissions.
![Login](/assets/login.png)

### Admin Dashboard
- Manage users (Add, Edit, Delete).
- Role assignment and quote category updates for users.
- Search, sort and filter users by role and category.

![Admin](/assets/admin-dashboard.png)

![addUser](/assets/add-user.png)

![editPage](/assets/edit-user.png)

### Manager Dashboard
- Update quote categories for users.
- Search and filter users for streamlined management.
![Manager](/assets/manager-dashboard.png)

![editCategory](/assets/edit-category.png)

### Dynamic Quotes Display:
- Users can view quotes dynamically fetched via API, updated according to their selected category.
- A clean and modern UI enhances the user experience.
![User](/assets/user-page.png)

## Technologies Used

### Frontend
- React.js with functional components and hooks (useState, useEffect).
- Tailwind CSS for styling and responsive design.

### Backend
- Node.js and Express.js for handling API requests.
- MongoDB for storing user data.
- JWT for user authentication.

### APIs:
- API Ninjas Quotes API for fetching quotes.

## Hosting
- Frontend hosted on Vercel.
- Backend hosted on Render.

## How it Works

### User Workflow
- Users log in using their credentials.
- Upon login, the application authenticates the user using a JWT token and retrieves user-specific details like username and category preferences.
- The application dynamically fetches and displays quotes from the selected category.

### Admin Workflow:
- Admins can manage users, assign roles, and update categories.
- Search, sorting, and filtering enable efficient management.

### Category Manager Workflow:
- Managers can update users' quote categories without modifying other details.

### Quotes API Integration:
- API requests include a secure API key passed via headers, ensuring access control.















 
 

