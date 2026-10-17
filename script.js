
/* BRAND LAND - السلة والبحث والمفضلة والقائمة */
'use strict';

function readBrandLandStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function getCart() {
  const cart = readBrandLandStorage('brandland_cart', []);
  return Array.isArray(cart) ? cart : [];
}

function saveCart(cart) {
  try {
    localStorage.setItem('brandland_cart', JSON.stringify(cart));
  } catch (error) {
    showToast('تعذر حفظ السلة على هذا الجهاز');
  }

  updateCartCount();
}

function addToCart(product, qty = 1) {
  if (!product || product.id == null) return;

  qty = Math.max(1, Number(qty) || 1);

  const cart = getCart();
  const existing = cart.find(
    item => String(item.id) === String(product.id)
  );

  if (existing) {
    existing.qty = (Number(existing.qty) || 0) + qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || '',
      qty
    });
  }

  saveCart(cart);
  showToast('✅ تمت الإضافة إلى السلة');
}

function removeFromCart(id) {
  saveCart(
    getCart().filter(item => String(item.id) !== String(id))
  );

  if (typeof renderCart === 'function') {
    renderCart();
  }
}

function updateQty(id, change) {
  const cart = getCart();
  const item = cart.find(
    entry => String(entry.id) === String(id)
  );

  if (!item) return;

  item.qty = Math.max(
    1,
    (Number(item.qty) || 1) + Number(change || 0)
  );

  saveCart(cart);

  if (typeof renderCart === 'function') {
    renderCart();
  }
}

function updateCartCount() {
  const count = getCart().reduce(
    (sum, item) => sum + Math.max(0, Number(item.qty) || 0),
    0
  );

  document.querySelectorAll('.cart-count').forEach(element => {
    element.textContent = count;
    element.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/* المفضلة */

function getFavorites() {
  const favorites = readBrandLandStorage(
    'brandland_favorites',
    []
  );

  return Array.isArray(favorites)
    ? favorites.map(String)
    : [];
}

function toggleFavorite(id, button) {
  const favorites = getFavorites();
  const key = String(id);
  const wasFavorite = favorites.includes(key);

  const next = wasFavorite
    ? favorites.filter(value => value !== key)
    : [...favorites, key];

  try {
    localStorage.setItem(
      'brandland_favorites',
      JSON.stringify(next)
    );
  } catch (error) {
    showToast('تعذر حفظ المفضلة على هذا الجهاز');
    return;
  }

  if (button) {
    button.classList.toggle('active', !wasFavorite);
    button.textContent = wasFavorite ? '♡' : '♥';

    button.setAttribute(
      'aria-pressed',
      String(!wasFavorite)
    );

    button.setAttribute(
      'aria-label',
      wasFavorite ? 'إضافة إلى المفضلة' : 'إزالة من المفضلة'
    );
  }

  showToast(
    wasFavorite
      ? 'تمت إزالة المنتج من المفضلة'
      : 'أضيف المنتج إلى المفضلة'
  );
}

/* البحث */

function normalizeSearchText(value) {
  return String(value || '')
    .toLocaleLowerCase('ar')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .trim();
}

function applyBrandLandSearch() {
  const input = document.getElementById('productSearch');
  const grid = document.getElementById('productsGrid');
  const status = document.getElementById('searchStatus');
  const clearButton = document.getElementById('clearSearch');

  if (!input || !grid) return;

  const query = normalizeSearchText(input.value);
  const cards = grid.querySelectorAll('.product-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const text = normalizeSearchText(card.textContent);
    const matches = !query || text.includes(query);

    card.hidden = !matches;

    if (matches) {
      visibleCount++;
    }
  });

  if (status) {
    if (!query) {
      status.textContent = '';
    } else if (visibleCount > 0) {
      status.textContent = `عدد المنتجات المطابقة: ${visibleCount}`;
    } else {
      status.textContent = 'لم نعثر على منتجات مطابقة';
    }
  }

  if (clearButton) {
    clearButton.hidden = !input.value;
  }
}

function setupBrandLandSearch() {
  const input = document.getElementById('productSearch');

  if (!input || input.dataset.searchReady === 'true') {
    return;
  }

  input.dataset.searchReady = 'true';

  const container = input.parentElement;
  let clearButton = document.getElementById('clearSearch');

  if (!clearButton && container) {
    clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.id = 'clearSearch';
    clearButton.className = 'clear-search';
    clearButton.textContent = '✕';
    clearButton.setAttribute('aria-label', 'مسح البحث');
    clearButton.hidden = true;
    container.appendChild(clearButton);
  }

  input.addEventListener('input', applyBrandLandSearch);

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      input.value = '';
      applyBrandLandSearch();
      input.focus();
    });
  }
}

/* القائمة الجانبية */

function toggleMenu(forceOpen) {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');

  if (!menu || !overlay) return;

  const open = typeof forceOpen === 'boolean'
    ? forceOpen
    : !menu.classList.contains('open');

  menu.classList.toggle('open', open);
  overlay.classList.toggle('show', open);

  overlay.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);

  const menuButton = document.querySelector(
    '.header-left .icon-btn'
  );

  if (menuButton) {
    menuButton.setAttribute('aria-expanded', String(open));
  }
}

function setupBrandLandMenu() {
  const menu = document.getElementById('sideMenu');

  if (menu && menu.dataset.menuReady !== 'true') {
    menu.dataset.menuReady = 'true';

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  if (document.documentElement.dataset.escapeReady !== 'true') {
    document.documentElement.dataset.escapeReady = 'true';

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        toggleMenu(false);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  setupBrandLandSearch();
  setupBrandLandMenu();
});
