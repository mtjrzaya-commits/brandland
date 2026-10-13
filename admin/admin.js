/* ===== BRAND LAND ADMIN - مع Firebase Authentication ===== */

// ===== Firebase SDK =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===== إعدادات Firebase =====
const firebaseConfig = {
  apiKey: "AIzaSyDRADYfXqdPxwVrN49XcWeYT6YhMnPvbLk",
  authDomain: "brandland-fe63e.firebaseapp.com",
  projectId: "brandland-fe63e",
  storageBucket: "brandland-fe63e.firebasestorage.app",
  messagingSenderId: "119294456074",
  appId: "1:119294456074:web:51af845d725776aa924af3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== الإعدادات الافتراضية =====
const DEFAULT_SETTINGS = {
  storeName: 'BRAND LAND',
  storeEmail: 'mtjrzaya@gmail.com',
  storePhone: '+966507000000',
  whatsapp: '+966507000000',
  storeAddress: 'الرياض، المملكة العربية السعودية',
  instagram: 'brandland',
  twitter: 'brandland',
  tiktok: 'brandland',
  currency: 'SAR',
  freeShippingMin: 500,
  shippingCost: 25
};

// ===== إدارة البيانات =====
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

// ===== تسجيل الدخول بـ Firebase =====
async function login(email, password){
  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('brandland_logged_in', 'true');
    localStorage.setItem('brandland_user_email', userCredential.user.email);
    return { success: true };
  }catch(error){
    return { success: false, error: error.code };
  }
}

async function logout(){
  try{
    await signOut(auth);
  }catch(e){}
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

// ===== مراقبة تسجيل الدخول =====
onAuthStateChanged(auth, (user) => {
  if(user){
    localStorage.setItem('brandland_logged_in', 'true');
    localStorage.setItem('brandland_user_email', user.email);
  } else {
    localStorage.removeItem('brandland_logged_in');
    localStorage.removeItem('brandland_user_email');
  }
});

// ===== الإشعارات =====
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

// ===== القائمة الجانبية =====
function toggleSidebar(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if(sidebar) sidebar.classList.toggle('open');
  if(overlay) overlay.classList.toggle('show');
}

// ===== المنتجات =====
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

// ===== الأقسام =====
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

// ===== البانرات =====
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

// ===== الطلبات =====
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

// ===== العملاء =====
function getCustomers(){ return getData('customers'); }
function saveCustomers(customers){ saveData('customers', customers); }

function deleteCustomer(id){
  if(!confirm('هل تريد حذف هذا العميل؟')) return false;
  const customers = getCustomers().filter(c => c.id !== id);
  saveCustomers(customers);
  showToast('🗑 تم حذف العميل');
  return true;
}

// ===== الإعدادات =====
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

// ===== الإحصائيات =====
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

// ===== الأدوات =====
function formatPrice(price){
  return (price || 0) + ' SAR';
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

// ===== تهيئة القائمة الجانبية =====
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

// ===== عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function(){
  initSidebar();
});

// ===== تصدير الدوال للاستخدام العالمي =====
window.login = login;
window.logout = logout;
window.isLoggedIn = isLoggedIn;
window.checkAuth = checkAuth;
window.showToast = showToast;
window.toggleSidebar = toggleSidebar;
window.getProducts = getProducts;
window.addProduct = addProduct;
window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
window.getCategories = getCategories;
window.addCategory = addCategory;
window.updateCategory = updateCategory;
window.deleteCategory = deleteCategory;
window.getBanners = getBanners;
window.addBanner = addBanner;
window.updateBanner = updateBanner;
window.deleteBanner = deleteBanner;
window.getOrders = getOrders;
window.saveOrders = saveOrders;
window.updateOrderStatus = updateOrderStatus;
window.deleteOrder = deleteOrder;
window.getCustomers = getCustomers;
window.saveCustomers = saveCustomers;
window.deleteCustomer = deleteCustomer;
window.getSettings = getSettings;
window.saveSettings = saveSettings;
window.updateSettings = updateSettings;
window.getStats = getStats;
window.formatPrice = formatPrice;
window.formatDate = formatDate;
window.escapeHtml = escapeHtml;
