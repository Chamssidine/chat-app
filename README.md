AI Chat App
An AI-powered chat application that enables users to interact with various GPT models, upload images and documents, and receive intelligent analyses—such as evaluating a CV against a specific job position.


Features
Multi-Model Support: Choose between different GPT models (e.g., GPT-3.5, GPT-4) for tailored responses.

Document Upload & Analysis: Upload documents (e.g., CVs) and receive analyses based on specific job descriptions.

Image Upload & Interpretation: Upload images for AI-driven insights and interpretations.

Real-Time Chat Interface: Engage in seamless conversations with the AI in a responsive chat environment.

Technologies Used
Frontend: React, Vite, Tailwind CSS

Backend: Node.js, Express

AI Integration: OpenAI API for GPT models

Others: ESLint for code linting, PostCSS for CSS transformations

Getting Started
Prerequisites
Ensure you have the following installed:

Node.js (v14 or higher)

npm or yarn

Installation
Clone the repository:

bash
Copier
Modifier
git clone https://github.com/Chamssidine/chat-app.git
cd chat-app
Install dependencies:

bash
Copier
Modifier
npm install
Start the development server:

bash
Copier
Modifier
npm run dev
The application will be available at http://localhost:3000.

Building for Production
To build the application for production:

bash
Copier
Modifier
npm run build
The optimized files will be in the dist directory.

Usage
Select GPT Model: Choose your preferred GPT model from the available options.

Upload Document: Upload your CV or any relevant document.

Provide Job Description: Input the job description for which you want your CV analyzed.

Receive Analysis: The AI will evaluate your CV against the job description and provide feedback.

Note: For image uploads, ensure the images are clear and well-lit for optimal analysis.

Project Structure
arduino
Copier
Modifier
chat-app/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
├── server.js
├── package.json
├── vite.config.js
└── tailwind.config.js
public/: Static assets

src/: React components and pages

server.js: Backend server setup

vite.config.js: Vite configuration

tailwind.config.js: Tailwind CSS configuration

Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

License
This project is open-source and available under the MIT License.
