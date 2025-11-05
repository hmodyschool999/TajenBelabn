const branches = [
    {
        id: 1,
        name: "فرع ابو كبير",
        address: "مفارق متولي سعد - بجوار بنك مصر",
        image: "branche/1.jpg",
        mapsUrl: "https://maps.app.goo.gl/Uyxpn6kioCdixX8J9"
    },
    {
        id: 2,
        name: "فرع الزقازيق",
        address: "القوميه - بجوار مطعم طأطأ",
        image: "branche/2.jpg",
        mapsUrl: "https://maps.app.goo.gl/kqGoKAAf3VAhdf9n9"
    },
    {
        id: 3,
        name: "فرع ههيا",
        address: "بجوار المحكمه",
        image: "branche/3.jpg",
        mapsUrl: "https://maps.app.goo.gl/dA7PMAGMvu6ZohhPA"
    },
    {
        id: 4,
        name: "فرع فاقوس",
        address: "المنشيه الجديده - شارع ابو دهشان",
        image: "branche/4.jpg",
        mapsUrl: "https://maps.app.goo.gl/1FmWer1z6JBem8358"
    },
    {
        id: 5,
        name: "فرع كفرصقر",
        address: "امام مركز الشرطه",
        image: "branche/5.jpg",
        mapsUrl: "https://maps.app.goo.gl/rZmVVSUDiago7UjXA"
    }
];

function renderBranches() {
    const grid = document.getElementById('branches-grid');
    if (!grid) return;
    
    grid.innerHTML = branches.map((branch, index) => `
        <div class="branch-card" style="animation-delay: ${index * 100}ms">
            <div class="branch-image">
                <img loading="lazy" src="${branch.image}" alt="${branch.name}">
            </div>
            <div class="branch-content">
                <h3>${branch.name}</h3>
                <p>📍 ${branch.address}</p>
                <a href="${branch.mapsUrl}" target="_blank" class="btn btn-primary" style="width: 100%;">
                    عرض على الخريطة 🗺️
                </a>
            </div>
        </div>
    `).join('');
}

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

const menuBtn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });
}

function closeMobileMenu() {
    if (mobileNav) {
        mobileNav.classList.remove('active');
    }
}

const complaintsToggle = document.getElementById('complaints-toggle-fab');
const complaintsDropdown = document.getElementById('complaints-dropdown-fab');

if (complaintsToggle) {
    complaintsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        complaintsDropdown.classList.toggle('active');
    });
}

document.addEventListener('click', (e) => {
    if (complaintsDropdown && !e.target.closest('.fab-container')) {
        complaintsDropdown.classList.remove('active');
    }
});

const fabContainer = document.querySelector('.fab-container');
const contactSection = document.getElementById('contact');

if (fabContainer && contactSection) {
    const fabObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fabContainer.classList.add('fab-visible');
            } else {
                fabContainer.classList.remove('fab-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fabObserver.observe(contactSection);
}

function createBubbles() {
    const container = document.getElementById('bubble-container');
    if (!container) return;
    
    const bubbleCount = 3;
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 80 + 40;
        const duration = Math.random() * 8 + 12;
        const delay = Math.random() * 5;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDelay = `${delay}s`;
        bubble.style.animationDuration = `${duration}s`;
        
        container.appendChild(bubble);

        setTimeout(() => bubble.remove(), (duration + delay) * 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderBranches();
    
    setTimeout(() => {
        setInterval(nextSlide, 5000);
        setInterval(createBubbles, 4000);
        createBubbles();
    }, 500);

});



