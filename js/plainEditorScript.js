import renderPlainEditor from './renderPlainEditor.js';
import runPlainEditorToolbar from './runPlainEditorToolbar.js';



// функция renderPlainEditor создает текстовое (.editor-textField) и 
//панель инструментов (.editor-toolbar) в диве, который указан как root.
// внутри тулбара  создаются все кнопки.

renderPlainEditor(document.body);

// функция runPlainEditorToolbar  навешивает обработчики на все кнопки тулбара.
// обработчики создают сами функции форматирования, а также позволяют подсвечивать
// активные кнопки. К примеру, "В" когда выделен полужирный текст 
//или название шрифта и размер выделенного куска.

runPlainEditorToolbar();
