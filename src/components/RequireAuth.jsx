import { Navigate, useLocation } from 'react-router-dom';

// Guards pages that call authenticated APIs. Without this, a signed-out
// visitor could open e.g. /live-class and every request went out as
// `Authorization: Bearer null`, which the backend rejects with the confusing
// message "Invalid token". Now they are sent to log in and returned afterwards.
const RequireAuth = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return children;
};

export default RequireAuth;
