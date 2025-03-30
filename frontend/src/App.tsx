import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRoutes from "./routes/routes";
import AuthInitializer from "./features/auth/components/AuthInitializer";

function App() {
  return (
    <Provider store={store}>
      <>
        <AuthInitializer />
        <AppRoutes />
      </>
    </Provider>
  );
}

export default App;
