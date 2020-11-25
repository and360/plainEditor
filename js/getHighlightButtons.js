function getHighlightButtons(editorRoot) {

    // эта функция обходит выделенный фрагмент текста поэлементно и собирает в массивы его параметры
    // все теги, размер и цвет шрифта, цвет бэкграунда

    let highLight = {}; //  сам объект который мы передадим

    if (!editorRoot.textContent) { //  если в редакторе пусто
        highLight.tagArr = ['document-fragment'];
        return highLight;
    }

    const selection = window.getSelection(), // получим выделение
        getSelection = selection.getRangeAt(0).cloneContents(), // скопируем весь фрагмент
        children = getSelection.children, //  получим детей, начальный и конечный контейнер выделения.
        startCont = selection.getRangeAt(0).startContainer,
        endCont = selection.getRangeAt(0).endContainer;

    let tagArr = [], // это массивы в которые все засунем и тд
        justifyArr = [],
        fontFamilyArr = [],
        fontSizeArr = [],
        lineHeightArr = [],
        colorArr = [],
        backgroundColorArr = [],
        childArr = [],
        collectionItem;

    function pushToStyleArrays(element) { //  если очередной элемент имеет нужный стиль то пушим его в массив.
        if(element.style['text-align']) {
            justifyArr.push(element.style['text-align']); 
        }

        if(element.style['font-family']) {
            fontFamilyArr.push(element.style['font-family']); 
        }

        if(element.style['font-size']) {
            fontSizeArr.push(element.style['font-size']); 
        }

        if(element.style['line-height']) {
            lineHeightArr.push(element.style['line-height']); 
        }

        if(element.style.color) {
            colorArr.push(element.style.color); 
        }

        if(element.style['background-color']) {
            backgroundColorArr.push(element.style['background-color']); 
        }
    }


    function pushResult(collection) {
        function pushChildElements(child) { // рекурсивно обходим фрагмент
            if(child.children) {
                let childItem;
                for(childItem of child.children) {
                    childArr.push(childItem.nodeName); // пушим тэг каждого child
                    pushToStyleArrays(childItem);
                    pushChildElements(childItem);
                } 
            }
        }
        for(collectionItem of collection) {
            childArr.push(collectionItem.nodeName);
            pushToStyleArrays(collectionItem); 
            pushResult(collectionItem.children);
            pushChildElements(collectionItem);
            tagArr.push(childArr); // пушим в итоговый массив. получим массив массивов
            childArr = [];  // чистим для следующей итерации
        }  
    }

    function pushIfStartIsEqualEnd() { //  если выделен маленький кусок.
        let parentElement = startCont.parentElement;
        while(parentElement !== editorRoot) {
            //if(parentElement !== null) { вылетает или виснет при использовании HR. родительская нода=null.
                childArr.push(parentElement.nodeName);
                pushToStyleArrays(parentElement); 
                parentElement = parentElement.parentNode;
            //}    
        }
        if(parentElement === editorRoot) {
            childArr.push('root');
            }
        tagArr.push(childArr);
        childArr = []; 
    }

    if(startCont.isEqualNode(endCont)) { // запускаем все это.
        pushIfStartIsEqualEnd();
    } else {  
        childArr.push(startCont.parentElement.nodeName);
        tagArr.push(childArr); 
        childArr = [];
        pushResult(children);
    }
    tagArr = tagArr.filter(item => item.length !== 0); //  удаляем пустые массивы

    highLight.tagArr = tagArr;
    highLight.justifyArr = justifyArr;
    highLight.fontFamilyArr = fontFamilyArr;
    highLight.fontSizeArr = fontSizeArr;
    highLight.lineHeightArr = lineHeightArr;
    highLight.colorArr = colorArr;
    highLight.backgroundColorArr = backgroundColorArr;  // добавляем все в кучу

    return highLight; //  теперь все.

}

export default getHighlightButtons;