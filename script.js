const products = [
    {
        id: 1,
        name: "The Huskey and his White Cat Shizun",
        image: "whitecatshizun.jpg",
        price: 19.99,
        category: "Danmei",
        description: "Cruel tyrant Taxian-jun killed his way to the throne and now reigns as the first ever emperor of the mortal realm. Yet somehow, he is unsatisfied. Left cold and bereft, abandoned by all he held dear, he takes his own life...only to be reborn anew."
    },
    {
        id: 2,
        name: "No Longer Human",
        image: "nolongerhuman.jpg",
        price: 14.95,
        category: "Fiction",
        description: "A troubled man incapable of revealing his true self to others, and who, instead, maintains a façade of hollow jocularity."
    },
    {
        id: 3,
        name: "Fourth Wing",
        image: "forthwing.jpg",
        price: 24.99,
        category: "Fantasy",
        description: "Twenty-year-old Violet Sorrengail was supposed to enter the Scribe Quadrant, living a quiet life among books and history. Now, the commanding general―also known as her tough-as-talons mother―has ordered Violet to join the hundreds of candidates striving to become the elite of Navarre: dragon riders."
    },
    {
        id: 4,
        name: "True Beauty",
        image: "truebeauty.jpg",
        price: 19.99,
        category: "Manga",
        description: "A shy comic book fan masters the art of makeup and sees her social standing skyrocket as she becomes her school's prettiest pretty girl overnight."
    },
    {
        id: 5,
        name: "Milk and Honey",
        image: "milkandhoney.jpg",
        price: 9.99,
        category: "Poetry",
        description: "A collection of poetry and prose about survival. About the experience of violence, abuse, love, loss, and femininity."
    },
    {
        id: 6,
        name: "Fifty Words for Rain",
        image: "fiftywords.jpg",
        price: 19.99,
        category: "Fiction",
        description: "Kyoto, Japan, 1948. “Do not question. Do not fight. Do not resist.” Spanning decades and continents, Fifty Words for Rain is a dazzling epic about the ties that bind, the ties that give you strength, and what it means to be free."
    },
    {
        id: 7,
        name: "The Girl on the Train",
        image: "girlonthetrain.jpg",
        price: 24.99,
        category: "Thriller",
        description: "Unreliable narrators and psychological thrillers naturally fit well together, but rarely better than in this book. It all begins when Rachel sees something she isn’t supposed to see, and the spiral doesn’t let up from there. "
    },
    {
        id: 8,
        name: "A Court of Thrones and Roses",
        image: "ACOTAR.jpg",
        price: 22.99,
        category: "Fantasy",
        description: "Feyre is a huntress. She thinks nothing of slaughtering a wolf to capture its prey. But, like all mortals, she fears what lingers beyond the forest."
    },
    {
        id: 9,
        name: "Fahrenheit 451",
        image: "f451.jpg",
        price: 22.99,
        category: "Science Fiction",
        description: "A future American society where books have been outlawed and supposed firemen burn any that are found."
    },
    {
        id: 10,
        name: "The Seven Deaths of Evelyn Hardcastle",
        image: "sevendeaths.jpg",
        price: 16.99,
        category: "Mystery",
        description: "A thriller following an investigation into the murder of a girl who is murdered every singe night."
    }
];

const productListDiv = document.getElementById('product-list');
const searchBar = document.getElementById('search-bar');
const sortOptions = document.getElementById('sort-options');
const categoryFilter = document.getElementById('category-filter');
const noResultsDiv = document.getElementById('no-results');

const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCartModalButton = document.getElementById('close-cart-modal');
const cartItemsDisplay = document.getElementById('cart-items-display');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartTotalDisplay = document.getElementById('cart-total');

let cart = JSON.parse(localStorage.getItem('bookEmporiumCart')) || [];


let currentProducts = [...products];

function displayProducts(productsToDisplay, searchTerm = '') {
    productListDiv.innerHTML = '';

    if (productsToDisplay.length === 0) {
        noResultsDiv.classList.remove('hidden');
        return;
    } else {
        noResultsDiv.classList.add('hidden');
    }

    productsToDisplay.forEach(product => {
        let displayName = product.name;
        if (searchTerm) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            displayName = product.name.replace(regex, '<span class="highlight">$1</span>');
        }

        const productCard = document.createElement('div');
        productCard.className = `
            bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300
            transform hover:-translate-y-1 border border-gray-100
            flex flex-col
        `;

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null;this.src='placeholder.jpg';">
            <div class="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-semibold mb-2">${displayName}</h3>
                    <p class="text-gray-600 text-sm mb-1">${product.category}</p>
                    <p class="text-gray-800 text-lg font-bold mb-4">$${product.price.toFixed(2)}</p>
                </div>
                <button class="add-to-cart-btn bg-blue-600 text-white py-2 px-4 rounded-lg
                               hover:bg-pink-600 transition-colors duration-300
                               font-medium shadow-md hover:shadow-lg"
                               data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;
        productListDiv.appendChild(productCard);

        productCard.querySelector('.add-to-cart-btn').addEventListener('click', (event) => {
            const productId = parseInt(event.target.dataset.productId);
            const productToAdd = products.find(p => p.id === productId);
            if (productToAdd) {
                const existingItem = cart.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ ...productToAdd, quantity: 1 });
                }
                saveCartToLocalStorage();
                updateCartUI();
                
                event.target.textContent = 'Added!';
                setTimeout(() => event.target.textContent = 'Add to Cart', 1000);
            }
        });
    });
}

function filterProducts() {
    const searchTerm = searchBar.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    sortProducts(filtered);
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

searchBar.addEventListener('keyup', debounce(filterProducts, 300));


function sortProducts(productsToSort) {
    const sortBy = sortOptions.value;

    productsToSort.sort((a, b) => {
        if (sortBy === 'name-asc') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'name-desc') {
            return b.name.localeCompare(a.name);
        } else if (sortBy === 'price-asc') {
            return a.price - b.price;
        } else if (sortBy === 'price-desc') {
            return b.price - a.price;
        }
        return 0;
    });

    currentProducts = productsToSort;
    displayProducts(currentProducts, searchBar.value.toLowerCase().trim());
}

sortOptions.addEventListener('change', () => {
    filterProducts();
});

function populateCategories() {
    const categories = new Set(products.map(product => product.category));
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

categoryFilter.addEventListener('change', filterProducts);


function saveCartToLocalStorage() {
    localStorage.setItem('bookEmporiumCart', JSON.stringify(cart));
}

function updateCartUI() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    cartItemsDisplay.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
    } else {
        emptyCartMessage.classList.add('hidden');
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = "flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0";
            cartItemDiv.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsDisplay.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });
    }
    cartTotalDisplay.textContent = total.toFixed(2);
}

cartIcon.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    updateCartUI();
});

closeCartModalButton.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.classList.add('hidden');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    sortProducts([...products]);
    updateCartUI();
});