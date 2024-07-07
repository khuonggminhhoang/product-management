/* Xử lý sự kiện counter */
const componentCounters = document.querySelectorAll('.inner-counter');
if(componentCounters.length > 0){
    for(let componentCounter of componentCounters){

        const subCounter = componentCounter.querySelector('.sub-counter'); 
        const addCounter = componentCounter.querySelector('.add-counter');
        const inputCounter = componentCounter.querySelector('.input-counter');

        let qty, unitPrice;

        if(subCounter && addCounter && inputCounter){

            subCounter.addEventListener('click', (event) => {
                const min = parseInt(inputCounter.min);
                const value = parseInt(inputCounter.value);
                if(value > min){
                    inputCounter.value = value - 1;
                }

                // để add sự kiện 'change' cho inputCounter
                const e = new Event('change');
                inputCounter.dispatchEvent(e);
            });
    
            addCounter.addEventListener('click', (event) => {
                const max = parseInt(inputCounter.max);
                const value = parseInt(inputCounter.value);
                if(value < max ){
                    inputCounter.value = value + 1;
                }
                
                // để add sự kiện 'change' cho inputCounter
                const e = new Event('change');
                inputCounter.dispatchEvent(e);

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

            });
        }

    }
} 

/* End Xử lý sự kiện counter */ 

/* Notification */
const notification = document.querySelector('[show-alert]');
if(notification){
    const time = parseInt(notification.getAttribute('data-time'));
    setTimeout(() => {
        notification.classList.add('show-hidden');
    }, time)

    const btnClose = notification.querySelector('.close');
    btnClose.addEventListener('click', () => {
        notification.classList.add('show-hidden');
    });
}

/* End notification */