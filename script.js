/* ===== BRAND LAND - إدارة السلة ===== */

// جلب السلة
function getCart(){
  return JSON.parse(localStorage.getItem('brandland_cart') || '[]');
}

// حفظ السلة
function saveCart(cart){
  localStorage.setItem('brandland_cart', JSON.stringify(cart));
  updateCartCount();
}

// إضافة منتج
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

// حذف منتج
function removeFromCart(id){
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  if(typeof renderCart === 'function') renderCart();
}

// تعديل الكمية
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

// عدد المنتجات في الشارة
function updateCartCount(){
  const count = getCart().reduce((s,i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// إشعار منبثق
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

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateCartCount);
ventListener('change',e=>{const q=Math.max(1,parseInt(e.target.value)||1);const c=readCart();const it=c.find(x=>x.id===row.dataset.id);if(it)it.qty=q;saveCart(c);renderCart()});row.querySelector('.remove-item').addEventListener('click',()=>{saveCart(readCart().filter(x=>x.id!==row.dataset.id));renderCart()})})}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function setupProduct(){const params=new URLSearchParams(location.search);const id=params.get('id')||'1';const item=catalog[id]||catalog['1'];const name=document.getElementById('detail-name');if(!name)return;name.textContent=item.name;document.getElementById('detail-price').textContent=money(item.price);const art=document.getElementById('detail-art');art.className=`product-art ${item.art}`;const btn=document.getElementById('detail-add');btn.dataset.id=id;btn.dataset.name=item.name;btn.dataset.price=item.price;btn.addEventListener('click',()=>addToCart(id,item.name,item.price,Math.max(1,parseInt(document.getElementById('quantity').value)||1)))}
function setupCheckout(){const host=document.getElementById('checkout-items');if(!host)return;const cart=readCart();host.innerHTML=cart.length?cart.map(i=>`<p>${escapeHtml(i.name)} × ${i.qty} <strong>${money(i.price*i.qty)}</strong></p>`).join(''):'<p>السلة فارغة.</p>';document.getElementById('checkout-total').textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0));const form=document.getElementById('checkout-form');form.addEventListener('submit',e=>{e.preventDefault();if(!readCart().length){alert('أضف منتجاً إلى السلة أولاً.');return}const data=Object.fromEntries(new FormData(form).entries());alert(`تم تجهيز بيانات الطلب تجريبياً يا ${data.name}. لم يُرسل الطلب؛ يلزم ربط الموقع بخدمة استقبال الطلبات.`)})}
document.addEventListener('DOMContentLoaded',()=>{updateCartCount();document.querySelectorAll('.add-to-cart').forEach(btn=>btn.addEventListener('click',()=>addToCart(btn.dataset.id,btn.dataset.name,btn.dataset.price)));renderCart();setupProduct();setupCheckout();const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();const clear=document.getElementById('clear-cart');if(clear)clear.addEventListener('click',()=>{saveCart([]);renderCart()})});
