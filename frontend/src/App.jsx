import "./App.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import { FlashMessageProvider } from "./context/FlashMessageContext.jsx";
import FlashMessage from "./components/FlashMessage.jsx";

function App() {
  return (
    <FlashMessageProvider>
      <AppRoutes />
      <FlashMessage />
    </FlashMessageProvider>
  );
}

export default App;
