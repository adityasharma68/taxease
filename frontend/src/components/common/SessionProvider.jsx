// src/components/common/SessionProvider.jsx
// Wraps authenticated pages — runs session manager & shows warning
import { useAuth } from "../../context/AuthContext";
import { useSessionManager } from "../../hooks/useSessionManager";
import SessionWarning from "./SessionWarning";

const SessionProvider = ({ children }) => {
  const { user, logout } = useAuth();

  const { warningVisible, countdown, stayActive, doLogout } =
    useSessionManager({ onLogout: logout });

  if (!user) return children;

  return (
    <>
      {children}
      {warningVisible && (
        <SessionWarning
          countdown={countdown}
          onStayActive={stayActive}
          onLogout={() => doLogout("manual")}
        />
      )}
    </>
  );
};

export default SessionProvider;
