import { useShop } from '../context/ShopContext';

export default function Toast() {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="toast-notification">
      <span style={{ color: '#B75D35', fontSize: '14px' }}>✔</span>
      <span>{toastMessage.text}</span>
    </div>
  );
}
