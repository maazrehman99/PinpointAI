# PinpointAI 🎯

A powerful AI-powered meeting analysis tool that automatically generates action tasks using GPT-4.

## 🌟 Features
- Real-time meeting analysis
- Automated action item generation
- Smart task categorization
- User authentication
- Intuitive interface
- Upload meeting notes in VTT or DOCX format
- Edit and delete tasks
- Export task lists as PDF

## 🚀 Tech Stack
### Frontend
- Next.js
- TypeScript
- Shadcn UI
- Tailwind CSS
- Lucide React

### Backend
- Express.js
- OpenAI API

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Clerk account for authentication

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/maazrehman99/PinpointAI
cd PinpointAI
```

### 2. Frontend Setup
- Navigate to the project root directory.
- Rename `.env.example` to `.env.local`.
- Configure the following environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL='http://localhost:3000/sign-in'
NEXT_PUBLIC_CLERK_SIGN_UP_URL='http://localhost:3000/sign-up'
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/analyzer/meeting
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/analyzer/meeting
NEXT_PUBLIC_API_URL=http://localhost:5000
```

- Install dependencies and start the frontend server:
```bash
npm install
npm run dev
```
The frontend will be running on [http://localhost:3000](http://localhost:3000).

### 3. Backend Setup
- Navigate to the backend directory:
```bash
cd backend
```
- Rename `.env.example` to `.env`.
- Configure the OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key
```
- Install dependencies and start the backend server:
```bash
npm install
npm start
```
The backend will be running on [http://localhost:5000](http://localhost:5000).

## 🎯 Usage
1. Sign up/Login using your credentials.
2. Upload meeting notes in **VTT** or **DOCX** format.
3. The AI will automatically analyze the meeting content and generate a task list with:
   - Relevant information like deadlines, assignees, and keywords.
4. Review, edit, or delete generated action items as needed.
5. Export the final task list as a **PDF** once satisfied.

## 🤝 Contributing
We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- OpenAI for providing the GPT-4 API
- Clerk for authentication services
- All contributors who helped in making this project better

## 📞 Support
For support, email [maazr098@gmail.com](mailto:maazr098@gmail.com) or open an issue in the repository.

Made with ❤️ by PinPoint AI
