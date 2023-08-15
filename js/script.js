const mainObj = {
    subTotal: 0,
    clientName: '',
    orderType: '',
}

const dishMenu = {};
let dishs = document.getElementById('dishs');

// ----- Obj creat -----

let idCounter = 0; 

function ObjCreate(name, type, price, left, imgSrc, qty, id = 'i'+idCounter++) {
    return dishMenu[`${name.toLowerCase()}`] = {
        name, type, price,
        left, imgSrc, qty, id,
    };
};

ObjCreate('Spicy seasoned seafood noodles', 'hot', 2.29, 20, 'dish_1', '0');
ObjCreate('Salted Pasta with mushroom sauce', 'cold', 2.69, 11, 'dish_2', '0');
ObjCreate('Beef dumpling in hot and sour soup', 'soup', 2.99, 16, 'dish_3', '0');
ObjCreate('Healthy noodle with spinach leaf', 'grill', 3.29, 22, 'dish_4', '0');
ObjCreate('Hot spicy fried rice with omelet', 'appetizer', 3.49, 13, 'dish_5', '0');
ObjCreate('Spicy instant noodle with special omelette', 'dessert', 3.59, 17, 'dish_6', '0');

// ----- Sub Total price -----

function subtotalFn() {
    mainObj.subTotal = 0;
    let spanObj = Array.from(document.querySelectorAll('.total_price'));
    if(spanObj.length > 0) {
        return spanObj.forEach(span => {
                mainObj.subTotal += +span.innerText; 
                document.getElementById('subTotal').innerText= `$ ${mainObj.subTotal.toFixed(2)}`;
            });
    }
    return document.getElementById('subTotal').innerText= `$ 0`;
}

// ----- Input search -----

let search = document.querySelector('.search input');

search.addEventListener('keyup', () => {
    dishs.innerHTML = '';
    for (meal in dishMenu) {
        if (dishMenu[`${meal}`].name.toLowerCase().indexOf(search.value.toLowerCase()) != -1) {
            creatCard(dishMenu[`${meal}`]);
            dishs.style.cssText = `justify-content: space-evenly;`
        };
    }
    if (!search.value.length) dishs.style.cssText = `justify-content: space-between;`;
})

// ----- Side-bar menu active -----

let liGroup = Array.from(document.querySelectorAll('.sideBar li'));

let img = document.createElement('img');
img.src = './img/menuSvg/menu_active-bg.svg'

liGroup.forEach(li => {
    li.addEventListener('click', (e) => {
        liGroup.map(list => {
            list.classList.remove('menu_active');
            if (list.firstElementChild.tagName == "IMG") list.firstElementChild.remove();
        });
        li.classList.add('menu_active');
        li.insertBefore(img, li.firstChild);
    })
});

// ----- Date -----

let dateBlock = Array.from(document.getElementById('date').children);

let Days = ['Sunday,', 'Monday,', 'Tuesday,', 'Wednesday,', 'Thursday,', 'Friday,', 'Saturday,'];

let Months = ['Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'Jul', 'August', 'Sep', 'Oct', 'Nov', 'Dec'];

const currentDay = new Date();

dateBlock[0].innerText = Days[currentDay.getDay()];
dateBlock[2].innerText = Months[currentDay.getMonth()];
dateBlock[1].innerText = currentDay.getDay();
dateBlock[3].innerHTML = currentDay.getFullYear();

// ----- Inner menu active -----

let menuItems = Array.from(document.querySelectorAll('.inner_menu li'));

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.map(elem => {
            elem.classList.remove('inner_menu_active');
            if (elem.lastElementChild.tagName == 'SPAN') elem.lastElementChild.remove();
        });
        item.classList.add('inner_menu_active');
        item.appendChild(document.createElement('span'));
        if (item.dataset.value == "all") {
            dishs.innerHTML = "";
            for (meal in dishMenu) creatCard(dishMenu[`${meal}`]);
            search.value = ""
            if (!search.value.length) return dishs.style.cssText = `justify-content: space-between;`;
        };

        for (meal in dishMenu) {
            if (item.dataset.value == dishMenu[`${meal}`].type) {
                dishs.innerHTML = "";
                search.value = "";
                creatCard(dishMenu[`${meal}`]);
            }
        }
    })
})

// ----- Dine In drop dowm menu & order buttons ----- 

let payment_section = document.querySelector('.payment_section');

document.body.addEventListener('click', (e) => dropDownFn(e));
payment_section.addEventListener('click', (e) => {
    dropDownFn(e);
    if(e.target.tagName == "SECTION") payment_section.style.cssText = `opacity: 0; visibility: hidden;`
});

function dropDownFn(e) {
    let bubleUls = Array.from(document.querySelectorAll('.type_menu'));
    bubleUls.forEach(buble => {
        if (e.target.parentElement == buble.parentElement) buble.classList.add('show');
        else buble.classList.remove('show');
    })
    Array.from(document.querySelectorAll('.type_menu li')).forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('#menu_display').forEach(item => item.innerHTML = li.textContent);
            buttonActive(li.textContent);
        })
    })
}

let buttonGroup = Array.from(document.querySelectorAll('.order_button button'));
function buttonActive(li_innerText) {
    buttonGroup.forEach(button => {
        if (button.innerText == li_innerText) {
            buttonGroup.map(btn => btn.classList.remove('order_active'));
            button.classList.add('order_active');
        };
    });
};

buttonGroup.map(btnItem => {
    btnItem.addEventListener('click', () => {
        buttonActive(btnItem.innerText);
        document.getElementById('menu_display').innerHTML = btnItem.innerText;
    });
});

// ----- Adding meal -----

for (menuItem in dishMenu) {
    creatCard(dishMenu[`${menuItem}`]);
    dishs.style.cssText = `justify-content: space-between;`
};

function creatCard(cardSrc) {
    let card = document.createElement('div');
    card.classList = 'dish_card';
    let img = document.createElement('img');
    let h3 = document.createElement('h3');
    let p1 = document.createElement('p');
    let p2 = document.createElement('p');
    h3.classList.add('dish_name');
    img.src = `./img/dishs/${cardSrc.imgSrc}.png`;
    h3.innerHTML = cardSrc.name;
    p1.innerHTML = '$ ' + cardSrc.price;
    p2.innerHTML = `${cardSrc.left} &nbsp; Bowls available`;

    dishs.appendChild(card);
    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(p1);
    card.appendChild(p2);
}

// ----- Order Item quantity and When they clicked -----

let dish_cards = Array.from(document.querySelectorAll('.dish_card'));

dish_cards.forEach(card => {
    card.addEventListener('click', () => {
        document.querySelector('.item_placeholder').style.display = "none";
        let card_name = card.firstElementChild.nextSibling.innerText;
        for(meal in dishMenu) {
            mealObj = dishMenu[`${meal}`];
            if(meal == card_name.toLowerCase() && mealObj.qty == 0) {
                mealObj.qty++;
                createItem(mealObj);
            }
            else if(meal == card_name.toLowerCase() && mealObj.qty > 0){
                document.querySelector(`#${mealObj.id} .quantity`).innerText = ++mealObj.qty
                document.querySelector(`#${mealObj.id} .total_price`).innerText = `${(mealObj.qty * mealObj.price).toFixed(2)}`;
            }
        }
        subtotalFn();
    })
})


// ----- Creating item to Order section -----

function createItem(src) {
    let item_Div = tagGenerator('div', 'item');
    let item_Top = tagGenerator('div', 'item_top_content');
    let item_note = tagGenerator('div', 'item_note');
    let img = tagGenerator('img', '');
    let img2 = document.createElement('img');
    img.src = `./img/dishs/${src.imgSrc}.png`;
    img2.src = "./img/homeSvg/Delete.svg";
    let item_des = tagGenerator('div', 'item_des');
    let h3 = tagGenerator('h3', '', `${src.name}`);
    let quantity = tagGenerator('div', 'quantity', `${src.qty}`);
    let p = tagGenerator('p', '', `$ ${src.price}`);
    let p2 = tagGenerator('p', "", '$ ');
    let total_price = tagGenerator('span', 'total_price', `${+src.price * src.qty}`);
    p2.appendChild(total_price);
    let input = document.createElement('input');
    input.setAttribute('placeholder', 'Order Note...');
    let button = tagGenerator('button', 'delete');
    button.appendChild(img2);
    item_Div.setAttribute('id', `${src.id}`);

    function tagGenerator(element, className, text_content = "") {
        let tag = document.createElement(element);
        tag.innerText = text_content;
        tag.classList = className; return tag;
    }
    appendFn(item_des, h3, p);
    appendFn(item_Top, img, item_des, quantity, p2);
    appendFn(item_note, input, button);
    appendFn(item_Div, item_Top, item_note)
    document.querySelector('.items').appendChild(item_Div);

    function appendFn(parent, ...children){
        children.forEach(child => parent.appendChild(child));
    }
    deleteBtnFn() 
}

// ----- Order section delete button -----

function deleteBtnFn() {
    let deleteBtn = Array.from(document.querySelectorAll('.delete'));
    deleteBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            let parentDiv = btn.parentElement.parentElement;
            for(objItem in dishMenu) {
                if(dishMenu[`${objItem}`].id == parentDiv.getAttribute('id')) 
                    dishMenu[`${objItem}`].qty = 0;
            }
            parentDiv.style.cssText = 'animation: deleteAnim 0.8s linear 1;';
            setTimeout(() => {
                parentDiv.remove();
                subtotalFn();
            }, 800);
            if(parentDiv.parentElement.children.length == 2) setTimeout(() => document.querySelector('.item_placeholder').style.display = "block", 800);
        })
    });
}

// ----- Continue to Payment click -----

let continue_payment = document.querySelector('.order_footer a'); 

continue_payment.addEventListener('click', () => {
    if(mainObj.subTotal == 0) return alert('You have to choose meal first.');
    payment_section.style.cssText = `visibility: visible; opacity: 1;`;
});

// ----- Pyment Methods -----

let methods = Array.from(document.querySelectorAll('.method'));

methods.forEach(btn => {
    btn.addEventListener('click', () => {
        methods.map(btn => {
            btn.classList.remove('active_method');
            if(btn.lastElementChild.tagName == 'IMG') btn.lastElementChild.remove();
        })
        btn.classList.add('active_method');
        btn.innerHTML += `<img src="./img/paymentSvg/payment_active.svg" alt="">`;
    })
})

// ---- Form -----

    // Error Function

    function errorFn(elem) {
        alert("You have to fill this field correctly...");
        elem.focus();
    }

const holderName = document.querySelector('#holder_name');

holderName.addEventListener('keyup', (e) => {
    mainObj.clientName = "";
    mainObj.clientName = e.target.value;
});

const cardNumber = document.getElementById('card_number');

    //  Number check Function

    function numberFilter(event) {
        let digitPeriodRegExp = new RegExp('\\d|\\.');
        if(event.ctrlKey || event.altKey || !isNaN(event.key) && event.code != "Space" || event.key.length !== 1) return true;
        if(!digitPeriodRegExp.test(event.key)) event.preventDefault();
    };

cardNumber.addEventListener('keydown', (e) => {
    let numberLength = cardNumber.value.length;
    if(!(numberLength++ % 5) && numberLength > 0 && e.key != "Backspace" && numberLength < 20) {
        numberFilter(e);
        return cardNumber.value += " ";
    }
    return numberFilter(e);
});

const form_date = document.querySelector('#form_date');

form_date.addEventListener('keydown', (e) => {
    if(form_date.value.length == 2 && e.key != "Backspace") form_date.value += "/";
    numberFilter(e);
});

const cvv = document.querySelector('#cvv');

cvv.addEventListener('keydown', (e) => {
    e.preventDefault();
    if(e.key == "Backspace") return cvvDelete(cvv.value.length - 1);
    function cvvDelete(n) {
        cvv.value = "";
        for(let i = 1; i <= n; i++) cvv.value += '•';
    }
    if(cvv.value.length >= 3) return;
    cvv.value += '•';
});

const table_number = document.querySelector('#table_number');

table_number.addEventListener('keydown', (e) => {
    numberFilter(e);
});

    //  Payment form Confirm 

    document.querySelector('.confirm').addEventListener('click', () => {
        if(holderName.value.length < 10) return errorFn(holderName);
        if(cardNumber.value.length < 20) return errorFn(cardNumber);
        if(+form_date.value.charAt(0) > 1 || +form_date.value.slice(3) > 2040 || +form_date.value.slice(3) < 2023 || form_date.value.length < 7) {
            form_date.value = "";
            return errorFn(form_date);
        };
        if(cvv.value.length < 3) return errorFn(cvv);
        if(table_number.value.length < 1) return errorFn(table_number);
        document.querySelectorAll('.payment *').forEach(child => {
            child.style.display = "none";
            document.querySelector('#done').style.display = "flex";
            document.querySelectorAll('#done *').forEach(item => {
                item.style.display = "inline-block";
            })
            setTimeout(() => {
                document.querySelectorAll('.payment input').forEach(input => {
                    input.value = "";
                })
                payment_section.style.cssText = `opacity: none; visibility: hidden;`
                child.style.display = "";
                document.querySelector('#done').style.display = "none";
                let items = Array.from(document.querySelector('.items').children);
                items.forEach(item => {
                    let itemName= document.querySelector(`#${item.getAttribute('id')} h3`);
                    if(item.tagName == "DIV") {
                        for(meal in dishMenu) {
                            if(meal == itemName.innerText.toLowerCase()) dishMenu[`${meal}`].qty = 0;
                        }
                        item.remove();
                        document.querySelector('.item_placeholder').style.display = "block";
                        subtotalFn();
                    };
                });
            }, 3000)
        });
    });