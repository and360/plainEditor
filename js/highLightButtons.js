import getHighlightButtons from './getHighlightButtons.js';

// в этом импорте функция, которая после каждого ввода, выделения или клика возвращает объект
// с параметрами выделенного текста (какие теги вложены, какой шрифт, какой цвет и тд)

function highLightButtons(arrayOfToolbarElementWithHighlight) {

    const root = document.querySelector('.editor-textField');
    const justityButtonsArr = [ //кнопки выравнивания текста, взял их отдельно.
                                    [document.querySelector('.toolbar-justifyCenter'), 'center'],
                                    [document.querySelector('.toolbar-justifyFull'), 'justify'],
                                    [document.querySelector('.toolbar-justifyLeft'), 'left'],
                                    [document.querySelector('.toolbar-justifyRight'), 'right']
                                ];

    root.addEventListener('click', toggleSelectedButtons);
    root.addEventListener('keydown', toggleSelectedButtons);

    function toggleSelectedButtons() { // сама функция с подстветкой.
        const highLight = getHighlightButtons(root); // получаем объект с параметрами.
        //console.log(highLight);  // можно увидеть что мы получили.
        const arrayOfHighlightButtons = highLight.tagArr; // массив массивов с тэгами, вложенными во фрагмент.


        function toggleSelectedButton(button, tag) { // если каждый контейнер содержит нужный тэг,
            if(arrayOfHighlightButtons.every(arr => arr.includes(tag))) {
                button.classList.add('selected'); //  то подсвечиваем,
            } else {
                button.classList.remove('selected'); // иначе убираем подсветку
            }
        }
        arrayOfToolbarElementWithHighlight.forEach(button => { // навешиваем на все элементы массива,
            toggleSelectedButton(button.element, button.tag); //  в который мы их пи создании поместили.
        });


        justityButtonsArr.forEach(arr => { // тоже подсветка, но я ее сильно упростил.
            toggleSelectedJustifyButton(arr[0], arr[1]);
        });

        function toggleSelectedJustifyButton(button, tag) {
            if( 
                highLight.justifyArr &&
                highLight.justifyArr[0] === tag &&
                highLight.justifyArr.every(item => item === highLight.justifyArr[0])
            ) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        }



        
        toggleSelectedSelectButtons('fontName', 
                                    'Шрифт', 
                                    highLight.fontFamilyArr,
                                    setValueOfSelect);

        toggleSelectedSelectButtons( 'fontSize', 
                                    'Размер', 
                                    highLight.fontSizeArr,
                                    setValueOfFontSize);


        function toggleSelectedSelectButtons(selectClass, defaultValue, targetArr, setNewValue) {
// переключать значения элементов select
            const currentSelect = document.querySelector(`.toolbar-${selectClass}`);// получаем select
            
            let currentValue = defaultValue; // текущее значение уснавливаем сначала по дефолту

            if( targetArr && // если массив вообще получен в объекте highLight
                targetArr.length !== 0 && // и если не пуст
                targetArr.every(item => item === targetArr[0]) //  то проверим нет ли там разных значений
                ) { // если нет разных значений размера шрифта или названия шрифта
                    const valueStr = targetArr[0],
                        re = /"/g,
                        newStr = valueStr.replace(re, ''); // то удалим лишние кавычки, кот. иногда добавляются
                    
                    currentValue = setNewValue(newStr, currentValue, selectClass);
// и запустим функцию, которая установит эти значения. для разных элементов она будет разная
                } else {       
                    currentValue = defaultValue; // если что-то не так, ставим значение по дефолту.
                } 
                            
            currentSelect.value = currentValue; // и устанавливаем его в value  элемента.
        }


        function setValueOfSelect(newStr, currentValue, selectClass) { // для шрифта просто переберем на совпадение

            const options = document.querySelectorAll(`.${selectClass}-option`);

            options.forEach(option => {
                if(option.value === newStr) {
                    currentValue = option.value;
                } 
            });
            
            return currentValue;
        }




        function setValueOfFontSize(newStr, currentValue) { 
            // здесь использую свитч, потому что значение размера шрифта это число, а в стиле пишет текст.
            switch(newStr) {
                case 'x-small':
                    currentValue = 1;
                    break;
                case 'small':
                    currentValue = 2;
                    break;
                case 'medium':
                    currentValue = 3;
                    break;
                case 'large':
                    currentValue = 4;
                    break;
                case 'x-large':
                    currentValue = 5;
                    break;
                case 'xx-large':
                    currentValue = 6;
                    break;
                case 'xxx-large':
                    currentValue = 7;
                    break;
                default:
                    currentValue = 'Размер';
                }
                return currentValue;
        }




        function setValueOfLineHeightSelect() {// примерно то же самое для селекта с межстрочным интервалом
            const lineHeight = document.querySelector('.toolbar-lineHeight');
            const ancestorContainer = document.getSelection().getRangeAt(0).commonAncestorContainer;
            
            if(ancestorContainer.style && ancestorContainer.style['line-height']) {
                lineHeight.value = ancestorContainer.style['line-height'];
            } else if(ancestorContainer.parentElement.style && ancestorContainer.parentElement.style['line-height']) {
                lineHeight.value = ancestorContainer.parentElement.style['line-height'];
            } else {
                lineHeight.value = 'Интервал';
            }
        }

        setValueOfLineHeightSelect();




        toggleSelectedColorButtons('toolbar-foreColor', '#ff0000', highLight.colorArr);
        toggleSelectedColorButtons('toolbar-hiliteColor', '#ffff00', highLight.backgroundColorArr);
// аналогично с цветом только сначала надо преобразовать значения ргб в 16-ричные
        function toggleSelectedColorButtons(selectClass, defaultValue, targetArr) {

            function rgbToHex(color) {
                let colorInRgb = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            
                return (colorInRgb && colorInRgb.length === 4) ? "#" +
                    ("0" + parseInt(colorInRgb[1],10).toString(16)).slice(-2) +
                    ("0" + parseInt(colorInRgb[2],10).toString(16)).slice(-2) +
                    ("0" + parseInt(colorInRgb[3],10).toString(16)).slice(-2) : '';
            }

            const currentSelect = document.querySelector(`.${selectClass}`);
            let currentValue = defaultValue;
            
            if( 
                targetArr && 
                targetArr.length !== 0 //&& 
                //targetArr.every(item => item === targetArr[0]) //  здесь че та не то я пока хз
                ) { 
                    const valueStr = targetArr[0],
                        valueInHex = rgbToHex(valueStr);

                    currentValue = valueInHex;
                } else {
                    currentValue = defaultValue;
                }

            currentSelect.value = currentValue;
        }
    }

    arrayOfToolbarElementWithHighlight.forEach(button => { //  тоглим просто на клик по кнопке
        button.element.addEventListener('click', () => {
            button.element.classList.toggle('selected');
        });
    });
}

export default highLightButtons;

