import { useEffect } from "react";
import { useToast } from "./contexts/ToastContext";
import { setApiToastHandler } from "./utils/apiClient";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRoutes from "./routes/routes";

function App() {
  const { showToast } = useToast();

  useEffect(() => {
    setApiToastHandler((message, type = "success") => {
      showToast({ message, type });
    });
  }, [showToast]);

  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
