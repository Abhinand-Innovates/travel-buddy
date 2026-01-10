import "./App.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import { FlashMessageProvider } from "./context/FlashMessageContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import FlashMessage from "./components/FlashMessage.jsx";

function App() {
  return (
    <AuthProvider>
      <FlashMessageProvider>
        <AppRoutes />
        <FlashMessage />
      </FlashMessageProvider>
    </AuthProvider>
  );
}

export default App;
