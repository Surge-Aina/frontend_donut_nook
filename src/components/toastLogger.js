import { toast } from 'react-toastify';
import axios from 'axios';

// Send toast info to backend
function sendLog(type, message) {
    const apiBase = process.env.REACT_APP_API_BASE_URL;
    axios.post(`${apiBase}/api/toastLogs`, { type, message })
        .catch(err => console.error('Toast log failed:', err));
}

['success', 'error', 'info', 'warn', 'warning'].forEach((method) => {
  const original = toast[method];
  toast[method] = (...args) => {
    const message = args[0]; // the message string
    sendLog(method, message);
    return original.apply(toast, args); // make the toast actually run
  };
});

export default toast;
