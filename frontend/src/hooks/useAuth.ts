import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { login, logout } from '../features/auth/redux/authSlice';
import { LoginCredentials } from '../features/auth/types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const loginUser = (credentials: LoginCredentials) => dispatch(login(credentials));
  const logoutUser = () => dispatch(logout());

  return {
    ...auth,
    loginUser,
    logoutUser,
  };
};
