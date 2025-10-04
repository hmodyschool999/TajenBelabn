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

const loadingScreen = document.getElementById('loading');
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownMenu = document.getElementById('dropdown-menu');
const menuContainer = document.getElementById('menu-container');
const bottomBar = document.getElementById('bottom-bar');
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
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            dropdownMenu.classList.add("hidden");
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
            grid.appendChild(createItemCard(item));
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

function createItemCard(item) {
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
    
    const priceContainer = document.createElement('div');
    priceContainer.className = "price-container mt-2";
    
    if (item.price2 !== undefined && item.price2 !== null) {
        priceContainer.innerHTML = `
            <div class="flex justify-start items-center gap-4">
                 <p class="text-xl font-bold text-white"><span class="font-medium text-gray-300">S:</span> ${item.price.toFixed(2)} ج.م</p>
                 <p class="text-xl font-bold text-white"><span class="font-medium text-gray-300">M:</span> ${item.price2.toFixed(2)} ج.م</p>
            </div>
        `;
    } else {
        priceContainer.innerHTML = `<p class="text-2xl font-bold text-[#6dd9f3]">${item.price.toFixed(2)} ج.م</p>`;
    }
    
    details.appendChild(priceContainer);
    
    card.appendChild(summary);
    card.appendChild(details);

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
    };

    return card;
}

function updateCallButton() {
    callNowBtn.href = branchPhoneNumbers[branchSelect.value] || '#';
}

document.addEventListener('DOMContentLoaded', () => {
    loadAndProcessMenu();
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    updateCallButton();
});

dropdownBtn.addEventListener('click', () => dropdownMenu.classList.toggle('hidden'));
branchSelect.addEventListener('change', updateCallButton);


let lastScrollY = window.scrollY;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const isAtBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 5;

    if (currentScrollY < lastScrollY || currentScrollY < 100) {
        header.classList.remove("translate-y-[-100%]");
    } else {
        header.classList.add("translate-y-[-100%]");
    }

    if (currentScrollY > lastScrollY && !isAtBottom) {
        bottomBar.classList.remove('visible');
    } else {
        bottomBar.classList.add('visible');
    }
    
    if (currentScrollY < 100) {
        bottomBar.classList.remove('visible');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
});