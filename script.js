import { menu, menu_database_db } from './menu.js';

const IMAGE_BASE_PATH = './images';
const categoryTranslations = { waffle: 'الوافل', omAli: 'أم علي', dessert: 'الركن الشرقي', milkshake: 'ميلك شيك', juice: 'عصائر', fruit_salad: 'فروت سلات', hot_drink: 'مشروبات ساخنة', extras: 'إضافات', ice_cream: 'آيس كريم', bamboza: 'بمبوظة', gelaktico: 'جلاكتيكوس', tajen: 'طواجن', qashtouta: 'قشطوطة', koshary: 'كشري الحلو', innovations: 'اختراعات', rice: 'أرز باللبن' };
const branchPhoneNumbers = { abokbeer: 'tel:01068702062', hehya: 'tel:01011350653', zagazig: 'tel:01080076320', faqous: 'tel:01068020434', kafrsaqr: 'tel:01068701310' };

function formatNameWithLineBreak(name, maxLength) {
    if (name.length <= maxLength) {
        return name;
    }
    const breakPointIndex = name.indexOf(' ', maxLength);
    if (breakPointIndex === -1) {
        return name;
    }
    const part1 = name.substring(0, breakPointIndex);
    const part2 = name.substring(breakPointIndex + 1);
    return `${part1}<br>${part2}`;
}

let cart = [];
const loadingScreen = document.getElementById('loading');
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownMenu = document.getElementById('dropdown-menu');
const menuContainer = document.getElementById('menu-container');
const cartPage = document.getElementById('cart-page');
const pageToggleButton = document.getElementById('page-toggle-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const totalPriceSpan = document.getElementById('total-price');
const branchSelect = document.getElementById('branch-select');
const callNowBtn = document.getElementById('call-now-btn');

function loadAndProcessMenu() {
    try {
        const categoriesInOrder = menu_database_db.sort((a, b) => a.seq - b.seq).map(cat => cat.name).filter(name => menu[name] && menu[name].length > 0);
        const processedMenu = {};
        categoriesInOrder.forEach(categoryName => {
            processedMenu[categoryName] = menu[categoryName].map(item => ({ ...item, full_image_path: `${IMAGE_BASE_PATH}/${categoryName}/${item.id}.jpg` }));
        });
        renderDropdown(categoriesInOrder);
        renderMenu(processedMenu, categoriesInOrder);
        loadingScreen.style.display = "none";
    } catch (error) {
        console.error("Error processing local menu data:", error);
        loadingScreen.innerHTML = `<div class="text-center p-4"><p class="text-red-500 text-xl font-bold">خطأ في عرض المنيو</p></div>`;
    }
}

function renderDropdown(categories) {
    dropdownMenu.innerHTML = "";
    categories.forEach(category => {
        const link = document.createElement("a");
        link.href = `#${category}`;
        link.textContent = categoryTranslations[category] || category;
        link.className = "block px-4 py-2 text-white hover:bg-[#0074d9] rounded-md mx-1";
        link.onclick = (e) => {
            e.preventDefault();
            const section = document.getElementById(category);
            if (section) {
                if (cartPage.classList.contains("hidden")) {
                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                    togglePageView();
                    setTimeout(() => { section.scrollIntoView({ behavior: "smooth", block: "start" }) }, 100);
                }
                dropdownMenu.classList.add("hidden");
            }
        };
        dropdownMenu.appendChild(link);
    });
}

function renderMenu(menuData, categoriesInOrder) {
    menuContainer.innerHTML = "";
    categoriesInOrder.forEach((categoryName, index) => {
        const section = document.createElement("section");
        section.id = categoryName;
        section.className = "menu-section";
        const title = document.createElement("h2");
        title.className = "text-3xl font-extrabold text-[#00a2fa] mb-6 border-b-2 border-[#0074d9]/50 pb-3";
        title.textContent = categoryTranslations[categoryName] || categoryName;
        section.appendChild(title);
        const grid = document.createElement("div");
        grid.className = "grid grid-cols-1 md:grid-cols-2 gap-6";
        menuData[categoryName].forEach(item => {
            grid.appendChild(createItemCard(item, categoryName));
        });
        section.appendChild(grid);
        menuContainer.appendChild(section);
        if (index < categoriesInOrder.length - 1) {
            const separator = document.createElement("hr");
            separator.className = "section-separator";
            menuContainer.appendChild(separator);
        }
    });
}

function createItemCard(item, category) {
    const card = document.createElement("div");
    card.className = "item-card relative rounded-lg shadow-xl overflow-hidden transition-all duration-300";
    card.style.setProperty("--banner-normal", `url('${IMAGE_BASE_PATH}/banner/normal.png')`);
    card.style.setProperty("--banner-expanded", `url('${IMAGE_BASE_PATH}/banner/expend.png')`);

    const handleImageError = function() {
        this.onerror = null;
        const noPicDiv = document.createElement('div');
        noPicDiv.className = "w-full h-full rounded-md bg-gray-700 flex items-center justify-center text-gray-400 text-xs";
        noPicDiv.textContent = 'No Pic';
        if (this.parentElement) {
            this.parentElement.replaceChild(noPicDiv, this);
        }
    };

    const summary = document.createElement("div");
    summary.className = "p-4 cursor-pointer flex items-center space-x-4 space-x-reverse";

    const summaryImgContainer = document.createElement('div');
    summaryImgContainer.className = 'relative w-20 h-20 flex-shrink-0';
    const summaryImg = document.createElement('img');
    summaryImg.src = item.full_image_path;
    summaryImg.alt = item.name;
    summaryImg.className = "w-20 h-20 rounded-md object-cover border-2 border-gray-600";
    summaryImg.loading = 'lazy';
    summaryImg.onerror = handleImageError;
    summaryImgContainer.appendChild(summaryImg);

    const summaryText = document.createElement('div');
    summaryText.className = 'flex-grow flex flex-col justify-center';
    const formattedName = formatNameWithLineBreak(item.name, 6);
    summaryText.innerHTML = `<h3 class="text-xl font-bold text-white">${formattedName}</h3>`;

    summary.appendChild(summaryImgContainer);
    summary.appendChild(summaryText);

    const details = document.createElement("div");
    details.className = "item-details px-4 pb-4 space-y-4";

    const detailsImgContainer = document.createElement('div');
    const detailsImg = document.createElement('img');
    detailsImg.src = item.full_image_path;
    detailsImg.alt = item.name;
    detailsImg.className = "w-full aspect-square object-cover rounded-lg border-2 border-gray-600";
    detailsImg.loading = 'lazy';
    detailsImg.onerror = handleImageError;
    detailsImgContainer.appendChild(detailsImg);
    details.appendChild(detailsImgContainer);

    if (item.description) {
        details.innerHTML += `<p class="text-white"><strong class="text-[#6dd9f3]">المكونات:</strong> ${item.description}</p>`;
    }

    details.innerHTML += `
        <div class="price-container flex justify-between items-center"></div>
        <div class="actions-container mt-4"></div>
    `;

    card.appendChild(summary);
    card.appendChild(details);

    const priceContainer = details.querySelector('.price-container');
    const actionsContainer = details.querySelector('.actions-container');
    const hasTwoPrices = item.price2 !== undefined && item.price2 !== null;
    let prices = [];

    if (hasTwoPrices) {
        priceContainer.innerHTML = `<p class="text-xl font-bold text-white">اختر الحجم:</p>`;
        const priceSelector = document.createElement('div');
        priceSelector.className = 'flex items-center justify-center gap-2 flex-wrap mb-4';
        prices = [{ label: 'S', price: item.price }, { label: 'M', price: item.price2 }];
        prices.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'price-btn';
            btn.dataset.price = p.price;
            btn.textContent = `${p.price.toFixed(2)} ج.م`;
            priceSelector.appendChild(btn);
        });
        actionsContainer.appendChild(priceSelector);
        const quantityControls = document.createElement('div');
        quantityControls.className = 'quantity-controls hidden';
        quantityControls.innerHTML = `<div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2"><button class="quantity-btn minus-btn">-</button><input type="number" value="1" min="1" class="item-quantity w-16 p-2 rounded bg-gray-700 text-white text-center font-bold"><button class="quantity-btn plus-btn">+</button></div><button class="add-to-cart-btn font-bold py-2 px-4 rounded-lg text-sm">أضف للسلة</button></div>`;
        actionsContainer.appendChild(quantityControls);
        priceSelector.querySelectorAll('.price-btn').forEach(btn => {
            btn.onclick = (e) => {
                priceSelector.querySelectorAll('.price-btn').forEach(b => {
                    b.classList.remove('selected');
                    if (b !== e.target) b.classList.add('hidden');
                });
                e.target.classList.add('selected');
                e.target.classList.remove('hidden');
                quantityControls.classList.remove('hidden');
            };
        });
    } else {
        priceContainer.innerHTML = `<p class="text-2xl font-bold text-[#6dd9f3]">${item.price.toFixed(2)} ج.م</p>`;
        actionsContainer.innerHTML = `<div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2"><button class="quantity-btn minus-btn">-</button><input type="number" value="1" min="1" class="item-quantity w-16 p-2 rounded bg-gray-700 text-white text-center font-bold"><button class="quantity-btn plus-btn">+</button></div><button class="add-to-cart-btn font-bold py-2 px-4 rounded-lg text-sm">أضف للسلة</button></div>`;
    }

    summary.onclick = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            const isCurrentlyExpanded = card.classList.contains('expanded');
            document.querySelectorAll(".item-card.expanded").forEach(c => {
                if (c !== card) c.classList.remove('expanded');
            });
            card.classList.toggle('expanded', !isCurrentlyExpanded);
        } else {
            const allCardsInGrid = Array.from(card.parentElement.children);
            const currentIndex = allCardsInGrid.indexOf(card);
            let pairCard = null;
            if (currentIndex % 2 === 0) {
                pairCard = allCardsInGrid[currentIndex + 1];
            } else {
                pairCard = allCardsInGrid[currentIndex - 1];
            }
            const isCurrentlyExpanded = card.classList.contains('expanded');
            document.querySelectorAll(".item-card.expanded").forEach(c => {
                if (c !== card && c !== pairCard) {
                    c.classList.remove('expanded');
                }
            });
            card.classList.toggle('expanded', !isCurrentlyExpanded);
            if (pairCard) {
                pairCard.classList.toggle('expanded', !isCurrentlyExpanded);
            }
        }
        const isCurrentlyExpanded = card.classList.contains('expanded');
        if (!isCurrentlyExpanded && hasTwoPrices) {
            actionsContainer.querySelector('.quantity-controls').classList.add('hidden');
            actionsContainer.querySelectorAll('.price-btn').forEach(b => {
                b.classList.remove('selected', 'hidden');
            });
        }
    };

    actionsContainer.addEventListener("click", e => {
        const target = e.target;
        const quantityInput = actionsContainer.querySelector('.item-quantity');
        if (target.matches('.plus-btn')) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        } else if (target.matches('.minus-btn')) {
            quantityInput.value = Math.max(1, parseInt(quantityInput.value) - 1);
        } else if (target.matches('.add-to-cart-btn')) {
            const quantity = parseInt(quantityInput.value);
            let selectedPrice = item.price;
            let sizeLabel = null;
            if (hasTwoPrices) {
                const selectedBtn = actionsContainer.querySelector('.price-btn.selected');
                if (!selectedBtn) { alert('الرجاء اختيار السعر أولاً'); return; }
                selectedPrice = parseFloat(selectedBtn.dataset.price);
                const foundPrice = prices.find(p => p.price === selectedPrice);
                sizeLabel = foundPrice ? foundPrice.label : null;
            }
            addToCart(item, category, quantity, { price: selectedPrice, size: sizeLabel }, target);
        }
    });

    return card;
}

function saveCart() { localStorage.setItem("tajenCart", JSON.stringify({ data: cart })) }
function loadCart() { const savedCart = localStorage.getItem("tajenCart"); if (savedCart) { cart = JSON.parse(savedCart).data || [] } updateCartDisplay() }

function addToCart(item, category, quantity, options, button) {
    const selectedPrice = options ? options.price : item.price;
    const size = options ? options.size : null;
    const cartItemId = `${item.id}_${category}_${selectedPrice}`;
    const existingItem = cart.find(i => i.cartItemId === cartItemId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const newItem = {
            ...item,
            cartItemId,
            category,
            quantity,
            price: selectedPrice,
            size: size
        };
        cart.push(newItem);
    }
    saveCart();
    updateCartDisplay();
    if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = "✔";
        button.disabled = true;
        setTimeout(() => { button.innerHTML = originalText; button.disabled = false; }, 1500);
    }
}

function updateCartQuantity(cartItemId, amount) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.cartItemId !== cartItemId);
        }
        saveCart();
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElem = pageToggleButton.querySelector("#cart-count");
    if (cartCountElem) cartCountElem.textContent = totalItems;
    cartItemsContainer.innerHTML = cart.length === 0 ? '<p class="text-center text-gray-400">سلة الطلبات فارغة حاليًا.</p>' : "";
    let total = 0;
    cart.forEach(item => {
        const cartItemElem = document.createElement("div");
        cartItemElem.className = "cart-item flex items-center justify-between p-3 rounded-lg";
        const price = parseFloat(item.price);
        const itemTotal = price * item.quantity;
        total += itemTotal;
        const displayName = item.size ? `${item.name} (${item.size})` : item.name;
        cartItemElem.innerHTML = `
<div class="flex items-center gap-3">
<img src="${item.full_image_path}" class="w-16 h-16 rounded-md object-cover">
<div>
<p class="font-bold text-white">${displayName}</p>
<div class="flex items-center gap-2 mt-1">
<button class="quantity-btn minus-btn">-</button>
<span class="text-sm text-gray-300 font-bold w-4 text-center">${item.quantity}</span>
<button class="quantity-btn plus-btn">+</button>
</div>
</div>
</div>
<div class="text-right">
<p class="font-semibold text-white">${itemTotal.toFixed(2)} ج.م</p>
<button class="text-red-500 text-xs hover:text-red-400 remove-from-cart-btn">إزالة</button>
</div>`;
        cartItemElem.querySelector(".plus-btn").onclick = () => updateCartQuantity(item.cartItemId, 1);
        cartItemElem.querySelector(".minus-btn").onclick = () => updateCartQuantity(item.cartItemId, -1);
        cartItemElem.querySelector(".remove-from-cart-btn").onclick = () => updateCartQuantity(item.cartItemId, -item.quantity);
        cartItemsContainer.appendChild(cartItemElem);
    });
    totalPriceSpan.textContent = `${total.toFixed(2)} ج.م`;
}

function togglePageView() {
    const isMenuVisible = !menuContainer.classList.contains("hidden");
    menuContainer.classList.toggle("hidden", isMenuVisible);
    cartPage.classList.toggle("hidden", !isMenuVisible);
    pageToggleButton.innerHTML = isMenuVisible
        ? `<span>📖</span> المنيو`
        : `<span>🛒</span> السلة(<span id="cart-count">${cart.reduce((s, i) => s + i.quantity, 0)}</span>)`;
    window.scrollTo(0, 0);
}
function updateCallButton() { callNowBtn.href = branchPhoneNumbers[branchSelect.value] || "#"; }

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadAndProcessMenu();
    updateCallButton();
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
});
dropdownBtn.addEventListener('click', () => dropdownMenu.classList.toggle('hidden'));
pageToggleButton.addEventListener('click', togglePageView);
branchSelect.addEventListener('change', updateCallButton);
callNowBtn.addEventListener('click', () => { if (cart.length > 0) saveCart(); });

let lastScrollY = window.scrollY;
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
    if (window.scrollY < lastScrollY || window.scrollY < 100) {
        header.classList.remove("translate-y-[-100%]");
    } else {
        header.classList.add("translate-y-[-100%]");
    }
    lastScrollY = window.scrollY <= 0 ? 0 : window.scrollY;
});
