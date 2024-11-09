const casualProducts = [
    {
        id: 1,
        name: "Áo Khoác Denim Classic",
        description: "Áo khoác denim classic, thiết kế hiện đại, form dáng thoải mái.",
        price: 1200000,
        originalPrice: 1500000,
        image: "img/casual-denim.jpg",
        colors: ['Navy', 'Brown', 'Black'],
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.5,
        reviews: 120,
        badges: ['new', 'bestseller']
    },
    {
        id: 2,
        name: "Áo Thun Basic",
        description: "Áo thun cotton 100%, form regular fit",
        price: 350000,
        image: "img/casual-tshirt.jpg",
        rating: 4.5,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 3,
        name: "Quần Jeans Slim Fit",
        description: "Quần jeans cao cấp, form slim fit năng động",
        price: 750000,
        image: "img/casual-jeans.jpg",
        rating: 4.8,
        sizes: [28, 29, 30, 31, 32, 33, 34]
    },
    {
        id: 4,
        name: "Sneakers Classic",
        description: "Giày sneaker thiết kế basic, dễ phối đồ",
        price: 890000,
        image: "img/casual-sneakers.jpg",
        rating: 4.7,
        sizes: [39, 40, 41, 42, 43]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initializeColorSelection();
    initializeSizeSelection();
    initializeQuickView();
    initializeWishlist();
    initializeAddToCart();
    updateCartCount();
});

function initializeColorSelection() {
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}

function initializeSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-options button');
    sizeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            button.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                button.style.animation = '';
            }, 300);
        });
    });
}

function initializeQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const modal = document.querySelector('.quick-view-modal');
    const closeModal = document.querySelector('.close-modal');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = button.closest('.suggestion-item').dataset.productId;
            const product = casualProducts.find(p => p.id === parseInt(productId));
            showQuickViewModal(product);
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showQuickViewModal(product) {
    const modal = document.querySelector('.quick-view-modal');
    const modalContent = modal.querySelector('.modal-product-details');

    modalContent.innerHTML = `
        <div class="quick-view-grid">
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quick-view-info">
                <h2>${product.name}</h2>
                <div class="product-rating">
                    <div class="stars">
                        ${getStarRating(product.rating)}
                    </div>
                    <span>(${product.reviews || 0} đánh giá)</span>
                </div>
                <p class="quick-view-description">${product.description}</p>
                <p class="quick-view-price">${formatPrice(product.price)}</p>
                <div class="quick-view-actions">
                    <select class="size-select">
                        <option value="">Chọn size</option>
                        ${product.sizes.map(size => `
                            <option value="${size}">Size ${size}</option>
                        `).join('')}
                    </select>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return `
        ${`<i class="fas fa-star"></i>`.repeat(fullStars)}
        ${hasHalfStar ? `<i class="fas fa-star-half-alt"></i>` : ''}
        ${`<i class="far fa-star"></i>`.repeat(emptyStars)}
    `;
}

function initializeWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!isUserLoggedIn()) {
            showNotification('Vui lòng đăng nhập để thêm vào danh sách yêu thích', 'warning');
            return;
        }

        wishlistBtn.classList.toggle('active');
        const isActive = wishlistBtn.classList.contains('active');
        showNotification(
            isActive ? 'Đã thêm vào danh sách yêu thích' : 'Đã xóa khỏi danh sách yêu thích',
            isActive ? 'success' : 'info'
        );
    });
}

function addToCart(productId, size) {
    if (!isUserLoggedIn()) {
        showNotification('Vui lòng đăng nhập để mua hàng', 'warning');
        return;
    }

    const selectedSize = size || document.querySelector('.size-options button.active')?.textContent;
    if (!selectedSize) {
        showNotification('Vui lòng chọn size', 'warning');
        return;
    }

    const product = casualProducts.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId && item.size === selectedSize);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            size: selectedSize,
            quantity: 1,
            dateAdded: new Date().toISOString()
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Đã thêm vào giỏ hàng', 'success');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function isUserLoggedIn() {
    return !!localStorage.getItem('fashion_store_current_user');
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}
