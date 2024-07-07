const inputCounters = document.querySelectorAll('input[update-cart]');

if(inputCounters.length > 0){
    inputCounters.forEach(item => {
        item.addEventListener('change', (e) => {
            const productId = e.target.getAttribute('product-id');
            const qty = e.target.value;
            window.location.href = `/cart/update/${productId}/${qty}`
        });
    });
}