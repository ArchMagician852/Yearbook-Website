document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // PRODUCTS
    // =====================================================

    const products = [

        {
            id: 1,
            name: "Super Mario Bros. Wonder",
            price: 59.99
        },

        {
            id: 2,
            name: "The Legend of Zelda",
            price: 59.99
        },

        {
            id: 3,
            name: "Mario Kart 8 Deluxe",
            price: 59.99
        },

        {
            id: 4,
            name: "Nintendo Switch Sports",
            price: 39.99
        }

    ];


    // =====================================================
    // CART
    // =====================================================

    let cart = [];


    // =====================================================
    // ELEMENTS
    // =====================================================

    const cartButton =
        document.getElementById("store-cart-button");

    const cartOverlay =
        document.getElementById("cart-overlay");

    const closeCartButton =
        document.getElementById("store-close-cart");

    const cartItems =
        document.getElementById("cart-items");

    const cartCount =
        document.getElementById("cart-count");

    const cartTotal =
        document.getElementById("cart-total");

    const checkoutButton =
        document.getElementById("checkout-button");

    const message =
        document.getElementById("store-message");

    const messageClose =
        document.getElementById("store-message-close");


    // =====================================================
    // ADD TO CART
    // =====================================================

    function addToCart(productId) {

        const product =
            products.find(item => item.id === productId);

        if (!product) {
            return;
        }

        cart.push(product);

        updateCart();

    }


    // =====================================================
    // REMOVE FROM CART
    // =====================================================

    function removeFromCart(index) {

        cart.splice(index, 1);

        updateCart();

    }


    // =====================================================
    // UPDATE CART
    // =====================================================

    function updateCart() {

        // Update count

        cartCount.textContent = cart.length;


        // Clear cart display

        cartItems.innerHTML = "";


        // Empty cart

        if (cart.length === 0) {

            const emptyMessage =
                document.createElement("p");

            emptyMessage.className = "empty-cart";

            emptyMessage.textContent =
                "Your cart is empty.";

            cartItems.appendChild(emptyMessage);

        }


        // Add cart items

        cart.forEach((product, index) => {

            const item =
                document.createElement("div");

            item.className = "cart-item";


            const name =
                document.createElement("span");

            name.className =
                "cart-item-name";

            name.textContent =
                product.name;


            const price =
                document.createElement("span");

            price.className =
                "cart-item-price";

            price.textContent =
                "$" + product.price.toFixed(2);


            const remove =
                document.createElement("button");

            remove.className =
                "remove-item";

            remove.textContent =
                "REMOVE";


            remove.addEventListener("click", () => {

                removeFromCart(index);

            });


            item.appendChild(name);

            item.appendChild(price);

            item.appendChild(remove);

            cartItems.appendChild(item);

        });


        // Calculate total

        let total = 0;

        cart.forEach(product => {

            total += product.price;

        });


        cartTotal.textContent =
            "$" + total.toFixed(2);

    }


    // =====================================================
    // OPEN CART
    // =====================================================

    function openCart() {

        cartOverlay.style.display = "flex";

    }


    // =====================================================
    // CLOSE CART
    // =====================================================

    function closeCart() {

        cartOverlay.style.display = "none";

    }


    // =====================================================
    // OPEN CART BUTTON
    // =====================================================

    cartButton.addEventListener("click", openCart);


    // =====================================================
    // CLOSE CART BUTTON
    // =====================================================

    closeCartButton.addEventListener("click", closeCart);


    // =====================================================
    // CLICK OUTSIDE CART
    // =====================================================

    cartOverlay.addEventListener("click", (event) => {

        if (event.target === cartOverlay) {

            closeCart();

        }

    });


    // =====================================================
    // ADD TO CART BUTTONS
    // =====================================================

    const addButtons =
        document.querySelectorAll(".add-to-cart");


    addButtons.forEach(button => {

        button.addEventListener("click", () => {

            const productId =
                Number(button.dataset.product);

            addToCart(productId);


            // Temporary button feedback

            const originalText =
                button.textContent;

            button.textContent =
                "ADDED!";


            setTimeout(() => {

                button.textContent =
                    originalText;

            }, 700);

        });

    });


    // =====================================================
    // CHECKOUT
    // =====================================================

    checkoutButton.addEventListener("click", () => {

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;

        }


        // Close cart

        closeCart();


        // Show fake confirmation

        message.style.display = "flex";

    });


    // =====================================================
    // CLOSE MESSAGE
    // =====================================================

    messageClose.addEventListener("click", () => {

        message.style.display = "none";

        // Empty the cart

        cart = [];

        updateCart();

    });


    // =====================================================
    // INITIALIZE
    // =====================================================

    updateCart();

});