import { useEffect, useState } from 'react';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

const NotificationToast = ({ message, type, duration = 5000, onClose }: NotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return 'X';
      case 'warning':
        return '!';
      case 'info':
        return 'i';
      default:
        return 'i';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600'; // Verde ND Drones
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-orange-500'; // Laranja ND Drones
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`fixed top-24 right-4 z-[9999] transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${getBgColor()} text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm border-l-4 border-white/30`}>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">{getIcon()}</span>
          <p className="text-sm font-medium flex-1 leading-relaxed">{message}</p>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-2 text-white/80 hover:text-white transition-colors text-lg leading-none font-bold"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast; 