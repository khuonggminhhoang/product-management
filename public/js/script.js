// Xử lý sự kiện counter
const componentCounters = document.querySelectorAll('.inner-counter');
if(componentCounters.length > 0){
    for(let componentCounter of componentCounters){

        const subCounter = componentCounter.querySelector('.sub-counter'); 
        const addCounter = componentCounter.querySelector('.add-counter');
        const inputCounter = componentCounter.querySelector('.input-counter');
        const innerPrice = componentCounter.parentElement.querySelector('.inner-price');

        let qty, unitPrice;

        if(subCounter && addCounter && inputCounter){
            if(innerPrice){
                qty = parseInt(inputCounter.value); 
                unitPrice = parseInt(innerPrice.textContent)/qty;
            }

            subCounter.addEventListener('click', (event) => {
                const min = parseInt(inputCounter.min);
                const value = parseInt(inputCounter.value);
                if(value > min){
                    inputCounter.value = value - 1;
                }

                if(innerPrice){
                    innerPrice.innerHTML = `${parseInt(inputCounter.value) * unitPrice}đ`;
                }

            });
    
            addCounter.addEventListener('click', (event) => {
                const max = parseInt(inputCounter.max);
                const value = parseInt(inputCounter.value);
                if(value < max ){
                    inputCounter.value = value + 1;
                }

                if(innerPrice){
                    innerPrice.innerHTML = `${parseInt(inputCounter.value) * unitPrice}đ`;
                }

            });
    
            inputCounter.addEventListener('change', (event) => {
                const min = parseInt(inputCounter.min);
                const max = parseInt(inputCounter.max);
    
                if(inputCounter.value == ''){
                    inputCounter.value = 1;
                }
                else if(parseInt(inputCounter.value) > max){
                    inputCounter.value = max;
                }
                else if(parseInt(inputCounter.value) < min){
                    inputCounter.value = min;
                }

                if(innerPrice){
                    innerPrice.innerHTML = `${parseInt(inputCounter.value) * unitPrice}đ`;
                }
            });
        }

    }
} 

// END