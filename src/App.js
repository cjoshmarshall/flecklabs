import { AuthProvider } from "./context/AuthProvider";
import { ModalProvider } from "./context/ModalProvider";
import Router from "./routes/Router";

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router />
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
