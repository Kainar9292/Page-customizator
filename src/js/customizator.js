export default class Customizator {
    constructor() {
        this.btnBlock = document.createElement('div');
        this.colorPicker = document.createElement('input');
        this.clear =document.createElement('div'); //создаем блок для кнопки очистки всех результатов
        this.scale = localStorage.getItem('scale') || 1;  //Обращаемся к localStorage и ищем значение scale(масштаб), если его нет то по умолчанию ставим 1
        this.color = localStorage.getItem('color') || '#ffffff'; //Обращаемся к localStorage и ищем значение color(масштаб), если его нет то по умолчанию ставим #ffffff

        this.btnBlock.addEventListener('click', (e) => this.onScaleChange(e));  //вешаем обработчик событий на кнопки
        this.colorPicker.addEventListener('input', (e) => this.onColorChange(e)); //вешаем обработчик событий на input изменение цвета фона
        this.clear.addEventListener('click', () => this.reset());  //вешаем обработчик событий на кнопку сброса всех параметров
    }

    onScaleChange(e) {   //создаем метод для кнопок масштаба
        const body = document.querySelector('body');
        if (e) {    //проверяем есть ли значение value у кнопок
            this.scale = +e.target.value.replace(/x/g, '');  //берем value из кнопок и превращаем его в числовое значение и отсекаем все x от строки с помощью регулярных выражений
        }

        const recursy = (element) => {  //создаем функцию для изменения масштаба
            element.childNodes.forEach(node => {  //перебираем каждый элементу заданного блока (будем передавать body)
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) { //проверяем, если Нода текстовая и значение ноды(с убранными пробелами) больше нуля
                    if (!node.parentNode.getAttribute('data-fz')) {  //если нет data аттрибута - т.е. не задавали его с помщью изменения масштаба 
                        let value = window.getComputedStyle(node.parentNode, null).fontSize; //создаем переменную которая берет все св-ва font-size у родительского нода
                        node.parentNode.setAttribute('data-fz', +value.replace(/px/g, '')); //родительскому ноду создается data аттрибут со значением размера исходного шрифта
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px'; //родительскому элементу присваивается inline стиль(исходный шрифт*масштаб заданный value у кнопки)
                    } else { //иначе
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px'; //если масштаб уже менялся то не меняем масштаб. Присваиваем inline стиль(исходный шрифт*масштаб заданный value у кнопки(1х))
                    }
                } else {
                    recursy(node);
                }
            });
        };
        recursy(body);
        localStorage.setItem('scale', this.scale); //перезаписываем в localStorage значение scale 
        // console.log(scale);
    }

    onColorChange(e) {  //метод для изменения цвета фона
        const body = document.querySelector('body'); 
        body.style.backgroundColor = e.target.value; //обращаемся к стилям body и вводим данные input которые выбрали
        localStorage.setItem('color', e.target.value); // В localStorage записываем ключ color со значением e.target.value(установленного цвета)
    }

    setBgColor() { //метод для применения значений цвета из localStorage
        const body = document.querySelector('body');
        body.style.backgroundColor = this.color; //применяем ко всему фону цвет который был записан в localStorage 
        this.colorPicker.value = this.color; //в input выбора цвета задаем значение цвета "color" из localStorage, чтобы он соответствовал цвету фона
    }


    injectStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            .panel {
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: fixed;
                top: 10px;
                right: 0;
                border: 1px solid rgba(0, 0, 0, .2);
                box-shadow: 0 0 20 px rgba(0, 0, 0, .5);
                width: 300px;
                height: 60px;
                background-color: #fff;
            }

            .scale {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100px;
                height: 40px;
            }

            .scale_btn {
                display: block;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(0, 0, 0, .2);
                border-radius: 4px;
                font-size: 18px;
            }

            .color {
                width: 40px;
                height: 40px;
            }

            .clear {
                font-size: 20px;
                cursor: pointer;
            }
        `;
        document.querySelector('head').appendChild(style);
    }

    reset() {   // Метод сброса всех параметров
        localStorage.clear();  //очищаем Localstorage
        this.scale = 1;        //мастаб для scale задаем 1, по умолчанию
        this.color = '#ffffff';//цвет задаем белый, по умолчанию
        this.setBgColor(); //метод для применения значений цвета из localStorage
        this.onScaleChange(); // вызываем метод изменения масштаба, без передачи значений из кнопок, данные берутся из метод для применения значений цвета из localStorage
    }

    render() {
        this.injectStyle(); //вызываем метод для внесения на страницу стилей
        this.setBgColor();  //метод для применения значений цвета из localStorage
        this.onScaleChange(); // вызываем метод изменения масштаба, без передачи значений из кнопок, данные берутся из метод для применения значений цвета из localStorage

        let scaleInputS = document.createElement('input'),
            scaleInputM = document.createElement('input'),
            panel = document.createElement('div');

        panel.append(this.btnBlock, this.colorPicker, this.clear); //добавляем в блок panel переменные(кнопки) класса Customizator
        this.clear.innerHTML = '&times';
        this.clear.classList.add('clear');

        scaleInputS.classList.add('scale_btn');
        scaleInputM.classList.add('scale_btn');
        
        this.btnBlock.classList.add('scale');
        this.colorPicker.classList.add('color');

        scaleInputS.setAttribute('type', 'button');  //меняем type инпута на button
        scaleInputM.setAttribute('type', 'button');
        scaleInputS.setAttribute('value', '1x');     //задаем атрибут кнопке 1х
        scaleInputM.setAttribute('value', '1.5x');   //задаем атрибут кнопке 1,5х
        this.colorPicker.setAttribute('type', 'color'); //задаем аттрибут color для type
        this.colorPicker.setAttribute('value', '#ffffff'); //ставим value, цыет во умолчанию

        this.btnBlock.append(scaleInputS, scaleInputM); //добавляем в переменную класса Customizator две кнопки масштаба

        panel.classList.add('panel');

        document.querySelector('body').append(panel); //добавляем в body блок panel в котором содержатся переменные(блоки) Customizator

        // console.log(this.btnBlock, scaleInputS, scaleInputM);
    }
}