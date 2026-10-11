/* ===== BRAND LAND - إدارة السلة ===== */

function getCart(){
  return JSON.parse(localStorage.getItem('brandland_cart') || '[]');
}

function saveCart(cart){
  localStorage.setItem('brandland_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product, qty){
  qty = qty || 1;
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if(existing){
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty
    });
  }
  saveCart(cart);
  showToast('✅ تمت الإضافة إلى السلة');
}

function removeFromCart(id){
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  if(typeof renderCart === 'function') renderCart();
}

function updateQty(id, change){
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if(item){
    item.qty += change;
    if(item.qty < 1) item.qty = 1;
    saveCart(cart);
    if(typeof renderCart === 'function') renderCart();
  }
}

function updateCartCount(){
  const count = getCart().reduce((s,i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

document.addEventListener('DOMContentLoaded', updateCartCount);
