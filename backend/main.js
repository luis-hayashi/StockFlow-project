function loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromLocalStorage();
    console.log(JSON.parse(localStorage.getItem('products')));
    const $registerForm = document.getElementById('registerForm');

    function getProductById(id) {
        const products = loadProductsFromLocalStorage();
        return products.find(product => product.id === id); 
    }

    const StockFlow = {
        product: []
    };

    function getLastProductId() {
        const products = loadProductsFromLocalStorage();
        if (products.length > 0) {
            return products[products.length - 1].id;
        } else {
            return 0;
        }
    }

    console.log(getLastProductId());

    function newProduct(data) {
        // Carrega produtos existentes do localStorage
        const products = loadProductsFromLocalStorage();
    
        // Adiciona o novo produto com o próximo ID disponível
        products.push({
            id: getLastProductId() + 1,
            nameProduct: data.nameProduct,
            price: data.price,
            quantity: data.quantity,
            description: data.description
        });
    
        // Atualiza o localStorage com o array atualizado de produtos
        localStorage.setItem('products', JSON.stringify(products));
    }

    $registerForm.addEventListener('submit', function newProductController(eventInfo) {
        const $nameProduct = document.getElementById('productName');
        const $price = document.getElementById('price');
        const $quantity = document.getElementById('quantity');
        const $description = document.getElementById('description');
        eventInfo.preventDefault();
        console.log("Criando novo produto.")
        newProduct(
            { 
                nameProduct: $nameProduct.value, 
                price: parseFloat($price.value), 
                quantity: parseFloat($quantity.value), 
                description: $description.value 
            }
        )

        $nameProduct.value = '';
        $price.value = '';
        $quantity.value = '';
        $description.value = '';

        const productId = 3; // ID do produto que você quer buscar
        const product = getProductById(productId);
        if (product) {
            console.log("Produto encontrado:", product);
        } else {
            console.log("Produto não encontrado com ID:", productId);
        }
    })
});

function displayProducts() {
    const products = loadProductsFromLocalStorage();
    const productList = document.getElementById('productList');
    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.textContent = `Id: ${product.id}, Nome: ${product.nameProduct}, Preço: ${product.price}, Quantidade: ${product.quantity}, Descrição: ${product.description}`;
        productList.appendChild(listItem);
    });
}

if (document.getElementById('productList')) {
    loadProductsFromLocalStorage();
    displayProducts(); // Exibe os produtos na lista
}

if (window.location.pathname === "/main-page/index.html") {
    loadProductsFromLocalStorage();
}
