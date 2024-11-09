const officeProducts = [
    {
        id: 1,
        name: "Bộ Vest Công Sở Cao Cấp",
        description: "Vest công sở chất liệu cao cấp, thiết kế thanh lịch, phù hợp môi trường chuyên nghiệp.",
        price: 3500000,
        image: "img/office-suit.jpg",
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 2,
        name: "Áo Sơ Mi Trắng Công Sở",
        description: "Áo sơ mi chất liệu cotton cao cấp, form dáng vừa vặn",
        price: 650000,
        image: "img/office-shirt.jpg",
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 3,
        name: "Giày Da Công Sở",
        description: "Giày da thật, thiết kế thanh lịch",
        price: 1500000,
        image: "img/office-shoes.jpg",
        sizes: [39, 40, 41, 42, 43]
    },
    {
        id: 4,
        name: "Thắt Lưng Da Cao Cấp",
        description: "Thắt lưng da bò thật, khóa kim loại cao cấp",
        price: 450000,
        image: "img/office-belt.jpg"
    }
];

function initializeOfficeLooks() {
    // Khởi tạo các sản phẩm gợi ý phối đồ công sở
    renderOfficeSuggestions();
    initializeSizeSelection();
    initializeAddToCart();
    initializeImageZoom();
    initializeAnimations();
}

function renderOfficeSuggestions() {
    const suggestionList = document.querySelector('.suggestion-list');
    suggestionList.innerHTML = officeProducts.slice(1).map(product => `
        <div class="suggestion-item" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>${formatPrice(product.price)}</p>
            <button class="add-to-cart">Thêm vào giỏ</button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    initializeOfficeLooks();
    updateCartCount();
});

// Cập nhật hàm addToCartWithAnimation
function addToCartWithAnimation(button, product) {
    // Kiểm tra đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('fashion_store_current_user'));
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để mua hàng!', 'warning');
        return;
    }

    // Kiểm tra size đã chọn chưa (nếu sản phẩm có size)
    if (product.sizes && !getSelectedSize()) {
        showNotification('Vui lòng chọn size!', 'warning');
        return;
    }

    button.innerHTML = '<i class="fas fa-check"></i> Đã thêm';
    button.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        button.innerHTML = 'Thêm vào giỏ';
        button.style.backgroundColor = '#2c3e50';
    }, 2000);

    const selectedSize = getSelectedSize();
    const cartItem = {
        ...product,
        size: selectedSize,
        quantity: 1,
        dateAdded: new Date().toISOString()
    };

    addToCart(cartItem);
    showNotification(`${product.name} đã được thêm vào giỏ hàng!`, 'success');
}

function getSelectedSize() {
    const activeButton = document.querySelector('.size-options button.active');
    return activeButton ? activeButton.textContent : null;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
