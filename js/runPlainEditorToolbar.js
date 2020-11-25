import highLightButtons from './highLightButtons.js';

function runPlainEditorToolbar() {
    class ToolbarElement { // общий класс для всех элементов
        constructor(htmlClass, command) {
            this.htmlClass = htmlClass;
            this.command = command;
            this.element = document.querySelector(this.htmlClass);
        }

        addExecCommandForButton() {
            this.element.addEventListener('click', (defaultUI = false, valueArg = null) => {
                document.execCommand(this.command, defaultUI, valueArg);
            }); // навесить execCommand, который уже и форматирует выделенный текст в зависимости от команды.
        }
    }




    class ToolbarElementInsertContent extends ToolbarElement { // класс кнопок, где не получилось использовать
        constructor(htmlClass) {                    //execCommand в лоб.
            super(htmlClass);
            this.command = 'insertHTML';
        }

        insertPicture() {
            this.element.addEventListener('click', () => {
                const insertImg = prompt('Введите URL изображения');
                if(insertImg !== null) {
                    document.execCommand(this.command, false, `<img src=${insertImg}>`);
                }   
            });
        }

        insertHTML() {
            this.element.addEventListener('click', () => {
                if(document.getSelection().isCollapsed) { // если выделение схлопнуто вставляем текст через промпт.
                    const insertText = prompt('Введите текст');
                    if(insertText !== null) {
                        document.execCommand('insertHTML', false, `<pre>${insertText}</pre>`); 
                    }
                } else { // если выделен какой-то текст, то он обернется в <pre></pre>.
                    document.execCommand(this.command, false, `<pre>${document.getSelection().toString()}</pre>`);
                } 
            });
        }

        setLineHeight() {// изменить межстрочный интервал.
            this.element.addEventListener('input', () => {
                const ancestorContainer = document.getSelection().getRangeAt(0).commonAncestorContainer;
                // это родительский контейнер для всего выделения.
                clearStyleOfDomFragment(ancestorContainer); //очистим инлайн стили вложенных эелементов

                function clearStyleOfDomFragment(container) {

                    if(container.style) {
                        container.style['line-height'] = ''; // если родитель не #text очистим стиль
                    } 
                    
                    if(container.children) {// обходит все вложенные элементы и удаляет  их стили.
                        const children = Array.from(container.children);
                        //console.log(children);
                        children.forEach(child => {
                            clearStyleOfDomFragment(child);
                        });
                    } 
                }
                
                if(ancestorContainer.style) {// если это не #text установим ему интервал из значения селекта.
                    ancestorContainer.style['line-height'] = this.element.value;
                } else if (ancestorContainer.parentElement.style) { // если #text то берем его родителя
                    ancestorContainer.parentElement.style['line-height'] = this.element.value;
                }   // а если и тот #text, то нихера не установится тогда
            });  
        }
    }

    new ToolbarElementInsertContent('.toolbar-picture').insertPicture(); // навесим обработчики на кнопки

    new ToolbarElementInsertContent('.toolbar-insertHTML').insertHTML();

    new ToolbarElementInsertContent('.toolbar-lineHeight').setLineHeight();




    class ToolbarElementForToggleCase extends ToolbarElement { // переключать заглавность/строчность.
        constructor(htmlClass) {
            super(htmlClass);
            this.command = 'insertHTML';
        }

        UpperCase() {
            this.element.addEventListener('click', () => {
                document.execCommand( this.command, false, document.getSelection().toString().toUpperCase() );
            });
        }

        LowerCase() {
            this.element.addEventListener('click', () => {
                document.execCommand(this.command, false, document.getSelection().toString().toLowerCase());
            });
        }
    }
    new ToolbarElementForToggleCase('.toolbar-toUpperCase').UpperCase();

    new ToolbarElementForToggleCase('.toolbar-toLowerCase').LowerCase();




    class ToolbarElementContext extends ToolbarElement { 
        constructor(htmlClass, command) {
            super(htmlClass, command);
            arrayOfToolbarElement.push(this); // сразу добавляем в массив, он потом нужен.
        }
    } // все эти кнопки работают тупо от метода execCommand. для каждой просто указываю команду.

    const arrayOfToolbarElement = []; //из него потом беру кнопки чтобы навестить подсветку при клике.

    const commandsElementContext = ['undo', 'redo', 'justifyCenter', 'justifyFull', 'justifyLeft', 
    'justifyRight', 'insertHorizontalRule', 'selectAll', 'delete', 'cut', 'copy', 'removeFormat'];

    function createToolbarElement(arr, className) { //навешиваем функционал на все кнопки массива
        arr.forEach(elem => {
            new className(`.toolbar-${elem}`, elem);
        });
    }

    createToolbarElement(commandsElementContext, ToolbarElementContext);




    class ToolbarElementWithTag extends ToolbarElement { //кнопки, которые оборачивают фрагмент в тэг
        constructor(htmlClass, command, tag) { //  тоже работают примитивно.
            super(htmlClass, command);
            this.tag = tag;
            arrayOfToolbarElement.push(this); // добавляем в тот же массив.
            arrayOfToolbarElementWithHighlight.push(this); //  это другой массив для другой подсветки
        }
    }

    const arrayOfToolbarElementWithHighlight = [];

    const commandsToolbarElementWithTag = [ 
                                            ['bold', 'B'], 
                                            ['italic', 'I'], 
                                            ['underline', 'U'],
                                            ['strikethrough', 'STRIKE'], 
                                            ['superscript', 'SUP'], 
                                            ['subscript', 'SUB'], 
                                            ['insertUnorderedList', 'UL'],
                                            ['insertOrderedList', 'OL'] 
                                        ];

    function createToolbarElementWithTag(arr) {
        arr.forEach(elem => {
            new ToolbarElementWithTag(`.toolbar-${elem[0]}`, elem[0], elem[1]);
        });
    }

    createToolbarElementWithTag(commandsToolbarElementWithTag);




// дальше еще несколько кнопок в двух классах. в принципе по шаблону.

    class ToolbarElementFormatBlock extends ToolbarElementWithTag {
        constructor(htmlClass, tag) {
            super(htmlClass);
            this.tag = tag;
            this.command = 'formatBlock';
            this.valueArg = this.tag.toLowerCase();
        }
        addExecCommandForButton() {
            this.element.addEventListener('click', (defaultUI = false) => {
                document.execCommand(this.command, defaultUI, this.valueArg);
            });
        }
    }

    const commandsToolbarElementFormatBlock = ['BLOCKQUOTE', 'H1', 'H2', 'H3'];

    createToolbarElement(commandsToolbarElementFormatBlock, ToolbarElementFormatBlock);

    arrayOfToolbarElement.forEach(element => {
        element.addExecCommandForButton();
    });




    class ToolbarElementWithInput extends ToolbarElement {
        constructor(htmlClass, command) {
            super(htmlClass, command);
            arrayOfToolbarElementWithInput.push(this);
        }
        addExecCommandForInput() {
            this.element.addEventListener('input', () => {
            document.execCommand('styleWithCSS', false, true);
            document.execCommand(this.command, false, this.element.value);
            document.execCommand('styleWithCSS', false, false);
            });
        }
    }

    const arrayOfToolbarElementWithInput = [];

    const commandsToolbarElementWithInput = ['fontName', 'fontSize', 'foreColor', 'hiliteColor'];

    createToolbarElement(commandsToolbarElementWithInput, ToolbarElementWithInput);

    arrayOfToolbarElementWithInput.forEach(element => {
        element.addExecCommandForInput();
    });



// это импортированная функция, которая определяет какие кнопки надо подсветить при данном выделении текста

    
    highLightButtons(arrayOfToolbarElementWithHighlight);
}

export default runPlainEditorToolbar;


