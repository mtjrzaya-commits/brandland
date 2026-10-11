/* ===== BRAND LAND ADMIN - الوظائف الرئيسية ===== */

const ADMIN_EMAIL = 'mtjrzaya@gmail.com';
const ADMIN_PASSWORD = 'brandland2026';

const DEFAULT_SETTINGS = {
  storeName: 'BRAND LAND',
  storeEmail: 'mtjrzaya@gmail.com',
  storePhone: '+966507000000',
  storeAddress: 'الرياض، المملكة العربية السعودية',
  whatsapp: '+966507000000',
  instagram: 'brandland',
  twitter: 'brandland',
  currency: 'SAR',
  freeShippingMin: 500,
  shippingCost: 25
};

function getData(key, defaultValue = []){
  try{
    const data = localStorage.getItem('brandland_' + key);
    return data ? JSON.parse(data) : defaultValue;
  }catch(e){
    return defaultValue;
  }
}

function saveData(key, value){
  localStorage.setItem('brandland_' + key, JSON.stringify(value));
}

function login(email, password){
  if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){
    localStorage.setItem('brandland_logged_in', 'true');
    localStorage.setItem('brandland_user_email', email);
    return true;
  }
  return false;
}

function logout(){
  localStorage.removeItem('brandland_logged_in');
  localStorage.removeItem('brandland_user_email');
  window.location.href = 'login.html';
}

function isLoggedIn(){
  return localStorage.getItem('brandland_logged_in') === 'true';
}

function checkAuth(){
  if(!isLoggedIn()){
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function showToast(message, type = 'success'){
  let toast = document.getElementById('toast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function toggleSidebar(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if(sidebar) sidebar.classList.toggle('open');
  if(overlay) overlay.classList.toggle('show');
}

function getProducts(){ return getData('products'); }
function saveProducts(products){ saveData('products', products); }

function addProduct(product){
  const products = getProducts();
  product.id = Date.now();
  product.createdAt = new Date().toISOString();
  products.push(product);
  saveProducts(products);
  showToast('✅ تم إضافة المنتج بنجاح');
  return product;
}

function updateProduct(id, updates){
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if(index !== -1){
    products[index] = {...products[index], ...updates};
    saveProducts(products);
    showToast('✅ تم تحديث المنتج');
    return true;
  }
  return false;
}

function deleteProduct(id){
  if(!confirm('هل تريد حذف هذا المنتج؟')) return false;
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  showToast('🗑 تم حذف المنتج');
  return true;
}

function getCategories(){ return getData('categories'); }
function saveCategories(categories){ saveData('categories', categories); }

function addCategory(category){
  const categories = getCategories();
  category.id = Date.now();
  category.createdAt = new Date().toISOString();
  categories.push(category);
  saveCategories(categories);
  showToast('✅ تم إضافة القسم بنجاح');
  return category;
}

function updateCategory(id, updates){
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if(index !== -1){
    categories[index] = {...categories[index], ...updates};
    saveCategories(categories);
    showToast('✅ تم تحديث القسم');
    return true;
  }
  return false;
}

function deleteCategory(id){
  if(!confirm('هل تريد حذف هذا القسم؟')) return false;
  const categories = getCategories().filter(c => c.id !== id);
  saveCategories(categories);
  showToast('🗑 تم حذف القسم');
  return true;
}

function getBanners(){ return getData('banners'); }
function saveBanners(banners){ saveData('banners', banners); }

function addBanner(banner){
  const banners = getBanners();
  banner.id = Date.now();
  banner.createdAt = new Date().toISOString();
  banners.push(banner);
  saveBanners(banners);
  showToast('✅ تم إضافة البانر');
  return banner;
}

function updateBanner(id, updates){
  const banners = getBanners();
  const index = banners.findIndex(b => b.id === id);
  if(index !== -1){
    banners[index] = {...banners[index], ...updates};
    saveBanners(banners);
    showToast('✅ تم تحديث البانر');
    return true;
  }
  return false;
}

function deleteBanner(id){
  if(!confirm('هل تريد حذف هذا البانر؟')) return false;
  const banners = getBanners().filter(b => b.id !== id);
  saveBanners(banners);
  showToast('🗑 تم حذف البانر');
  return true;
}

function getOrders(){ return getData('orders'); }
function saveOrders(orders){ saveData('orders', orders); }

function updateOrderStatus(id, status){
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if(index !== -1){
    orders[index].status = status;
    saveOrders(orders);
    showToast('✅ تم تحديث حالة الطلب');
    return true;
  }
  return false;
}

function deleteOrder(id){
  if(!confirm('هل تريد حذف هذا الطلب؟')) return false;
  const orders = getOrders().filter(o => o.id !== id);
  saveOrders(orders);
  showToast('🗑 تم حذف الطلب');
  return true;
}

function getCustomers(){ return getData('customers'); }
function saveCustomers(customers){ saveData('customers', customers); }

function deleteCustomer(id){
  if(!confirm('هل تريد حذف هذا العميل؟')) return false;
  const customers = getCustomers().filter(c => c.id !== id);
  saveCustomers(customers);
  showToast('🗑 تم حذف العميل');
  return true;
}

function getSettings(){
  const saved = getData('settings', null);
  return saved ? {...DEFAULT_SETTINGS, ...saved} : DEFAULT_SETTINGS;
}

function saveSettings(settings){
  saveData('settings', settings);
  showToast('✅ تم حفظ الإعدادات');
}

function updateSettings(key, value){
  const settings = getSettings();
  settings[key] = value;
  saveSettings(settings);
}

function getStats(){
  const products = getProducts();
  const orders = getOrders();
  const customers = getCustomers();
  const categories = getCategories();

  let totalSales = 0;
  orders.forEach(o => {
    if(o.status === 'completed'){
      totalSales += (o.total || 0);
    }
  });

  return {
    productsCount: products.length,
    ordersCount: orders.length,
    customersCount: customers.length,
    categoriesCount: categories.length,
    totalSales: totalSales,
    newOrders: orders.filter(o => o.status === 'new').length
  };
}

function formatPrice(price){
  return (price || 0) + ' ر.س';
}

function formatDate(dateStr){
  try{
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA') + ' ' + date.toLocaleTimeString('ar-SA', {hour:'2-digit', minute:'2-digit'});
  }catch(e){ return dateStr; }
}

function escapeHtml(text){
  if(!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function initSidebar(){
  const menuBtn = document.getElementById('menuBtn');
  if(menuBtn){
    menuBtn.addEventListener('click', toggleSidebar);
  }
  const overlay = document.getElementById('overlay');
  if(overlay){
    overlay.addEventListener('click', toggleSidebar);
  }
}

document.addEventListener('DOMContentLoaded', function(){
  initSidebar();
});
