import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/uiSlice';

export default function NotificationToast() {
  const { message, visible } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!visible) return;                                    // rien à faire si caché
    const timer = setTimeout(() => dispatch(hideToast()), 3000); // masque après 3 s
    return () => clearTimeout(timer);                        // nettoyage si le composant change/disparaît
  }, [visible, message, dispatch]);

  if (!visible) return null;                                 // rien n'est affiché
  return <div className="toast">{message}</div>;
}