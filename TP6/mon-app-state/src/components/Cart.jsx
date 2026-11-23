import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart, applyPromoCode } from '../redux/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  // On lit toutes les données du panier dans le store Redux
  const { items, totalCount, totalPrice, discountPercent } = useSelector((state) => state.cart);

  // État LOCAL : ce que l'utilisateur tape dans le champ (pas besoin de Redux pour ça)
  const [code, setCode] = useState('');

  // Prix après remise : 1210 * (1 - 20/100) = 968 ; sans remise (0 %) le prix ne change pas
  const discountedPrice = totalPrice * (1 - discountPercent / 100);

  return (
    <div className="cart-card">
      <div className="cart-header">
        <h2>Panier ({totalCount})</h2>
        {items.length > 0 && (
          <button onClick={() => dispatch(clearCart())}>Vider</button>
        )}
      </div>

      {items.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          {items.map((item) => (
            <div className="cart-row" key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>{item.price * item.quantity} DT</span>
              <button onClick={() => dispatch(removeItem(item.id))}>✕</button>
            </div>
          ))}

          {/* Défi 2 : champ code promo */}
          <div className="cart-row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code promo"
            />
            {/* trim() enlève les espaces, toUpperCase() accepte "poly2027" aussi */}
            <button onClick={() => dispatch(applyPromoCode(code.trim().toUpperCase()))}>
              Appliquer
            </button>
          </div>

          {discountPercent > 0 && (
            <p className="promo-ok">Code appliqué : -{discountPercent} %</p>
          )}

          <h3>Total : {discountedPrice} DT</h3>
        </>
      )}
    </div>
  );
}

export default Cart;