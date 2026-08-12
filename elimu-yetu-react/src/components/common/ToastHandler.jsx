import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ToastHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const toastData = location.state?.toast;

    if (toastData) {
      const { type = "success", message } = toastData;

      // trigger correct toast type
      if (type === "success") toast.success(message);
      else if (type === "error") toast.error(message);
      else if (type === "info") toast.info(message);
      else if (type === "warning") toast.warning(message);

      // clear state immediately
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return null; // nothing to render
}

export default ToastHandler;