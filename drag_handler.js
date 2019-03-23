/**
 * обеспечивает drag'n'drop
 * @param dragZones массив элементов, на которые делается drag'n'drop
 */
function getDragHandler(dragZones) {
    let dragObject = null;
    let mouseOffset;
    let eventsMapping = {
        mouseenter: 'dragIn',
        click: 'dragIn',
        mouseleave: 'dragOut',
        mouseup: 'dragDrop'
    };

    if(dragZones) {
        addDragZones(dragZones);
    }

    function addDragZone(dragZone) {
        dragZone.onmouseenter = dragZone.onmouseleave = dragZone.onmouseup = onEvent;
    }

    function addDragZones(dragZones) {
        for(let i=0, len=dragZones.length; i<len; i++) {
            addDragZone(dragZones[i]);
        }
    }

    function onEvent(e) {
        if(dragObject && e.target === this) {
            if(!this.dispatchEvent(new CustomEvent(eventsMapping[e.type], {detail: {dragObject: dragObject}, cancelable: true}))) {
                dragObject.style.transitionProperty = 'left top';
                dragObject.style.transitionDuration = '1s';
                dragObject.style.left = dragObject.takenFrom.left + 'px';
                dragObject.style.top = dragObject.takenFrom.top + 'px';
                documentOnMouseUp();
            }
        }
    }

    function documentOnMouseMove(e) {
        dragObject.style.left = e.pageX - mouseOffset.x + 'px';
        dragObject.style.top = e.pageY - mouseOffset.y + 'px';
    }

    function documentOnMouseUp() {
        document.onmousemove = null;
        document.onmouseup = null;
        document.body.style.cursor = 'auto';
        dragObject.style.cursor = 'grab';
        dragObject.style.zIndex = '100';
        dragObject.style.pointerEvents = "auto";
        dragObject = null;
    }

    document.onmousedown = function (e) {
        if (e.button !== 0 || // если клик не левой кнопкой мыши
            !e.target.classList.contains('draggable')) {
            return; // то не запускаем перенос
        }
        let target = e.target;
        let coords = getCoords(target);
        mouseOffset = {x: e.pageX - coords.left, y: e.pageY - coords.top};
        dragObject = target;
        document.onmousemove = documentOnMouseMove;
        document.onmouseup = documentOnMouseUp;
        target.style.zIndex = '101';
        target.style.pointerEvents = "none";
        target.style.cursor = document.body.style.cursor = 'grabbing';
        target.style.transition = '';
        if (target.parentElement !== document.body) {
            target.style.position = 'absolute';
            target.takenFrom = coords;
            document.body.appendChild(target);
            documentOnMouseMove(e);
        }

        function getCoords(elem) {   // кроме IE8-
            let box = elem.getBoundingClientRect();
            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset
            };
        }
    };

    return {
        // addDragZone: addDragZone,
        addDragZones: addDragZones
    }

}