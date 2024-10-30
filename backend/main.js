document.addEventListener('DOMContentLoaded', () => {
    const $registerForm = document.getElementById('registerForm');

    function loadProductsFromLocalStorage() {
        const storedProducts = localStorage.getItem('products');
        return storedProducts ? JSON.parse(storedProducts) : [];
    }

    loadProductsFromLocalStorage();

    const StockFlow = {
        product: []
    };

    function newProduct(data) {
        StockFlow.product.push({
            id: StockFlow.product.length + 1,
            nameProduct: data.nameProduct,
            price: data.price,
            quantity: data.quantity,
            description: data.description
        })

        localStorage.setItem('products', JSON.stringify(StockFlow.product));
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
    })
});