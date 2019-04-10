/**
 * обеспечивает drag'n'drop
 */
function getDragHandler() {
    let dragObject = null;
    let lastDragTarget = null;
    let mouseOffset;
    let isTouchScreen = 'ontouchstart' in document;
    let dragZones = [];
    let eventsMapping = {
        mouseenter: 'dragIn',
        click: 'dragIn',
        mouseleave: 'dragOut',
        mouseup: 'dragDrop'
    };

    function addDragZone(dragZone) {
        if(isTouchScreen) {
            dragZones.push(dragZone);
        }
        else {
            dragZone.onmouseenter = dragZone.onmouseleave = dragZone.onmouseup = onDragZoneEvent;
        }
    }

    function addDragZones(dragZones) {
        for(let i=0, len=dragZones.length; i<len; i++) {
            addDragZone(dragZones[i]);
        }
    }

    function putBackDragObject() {
        dragObject.style.transitionProperty = 'left top'; //возвращаем перетаскиваемый элемент на место, если целевой элемент его не принял
        dragObject.style.transitionDuration = '1s';
        dragObject.style.left = dragObject.takenFrom.left + 'px';
        dragObject.style.top = dragObject.takenFrom.top + 'px';
    }

    function onDragZoneEvent(e) {
        if(dragObject && e.target === this) {
            if(!this.dispatchEvent(new CustomEvent(eventsMapping[e.type], {detail: {dragObject: dragObject}, cancelable: true}))) {
                putBackDragObject();
            }
        }
    }

    function documentOnTouchStart(e) {
        documentOnMouseDown(e.touches[0]);
        if(dragObject) {
            document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).
            dispatchEvent(new CustomEvent('dragIn', {detail: {dragObject: dragObject}, cancelable: true}));
        }
    }

    function documentOnTouchEnd(e) {
        lastDragTarget = null;
        if(dragObject) {
            if(!document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY).
            dispatchEvent(new CustomEvent('dragDrop', {detail: {dragObject: dragObject}, cancelable: true}))) {
                putBackDragObject();
            }
        }
        documentOnMouseUp(e.changedTouches[0]);
    }

    function documentOnTouchMove(e) {
        let dragTarget;
        if(dragObject &&
            (dragTarget = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)) !== lastDragTarget) {
            if(lastDragTarget && !lastDragTarget.contains(dragTarget)) {
                lastDragTarget.dispatchEvent(new CustomEvent('dragOut', {detail: {dragObject: dragObject}, cancelable: true}));
            }
            if(dragZones.includes(dragTarget)) {
                if(!lastDragTarget || !dragTarget.contains(lastDragTarget)) {
                    dragTarget.dispatchEvent(new CustomEvent('dragIn', {detail: {dragObject: dragObject}, cancelable: true}));
                }
                lastDragTarget = dragTarget;
            }
            else {
                lastDragTarget = null;
            }
        }
        documentOnMouseMove(e.touches[0]);
    }

    function documentOnMouseMove(e) {
        dragObject.style.left = e.pageX - mouseOffset.x + 'px';
        dragObject.style.top = e.pageY - mouseOffset.y + 'px';
    }

    function documentOnMouseUp() {
        if(isTouchScreen) {
            document.ontouchmove = null;
            document.ontouchend = null;
        }
        else {
            document.onmousemove = null;
            document.onmouseup = null;
        }
        document.body.style.cursor = 'auto';
        dragObject.style.cursor = 'grab';
        dragObject.style.zIndex = '100';
        dragObject.style.pointerEvents = "auto";
        dragObject = null;
    }

    function documentOnMouseDown(e) {
        if (!e.target.classList.contains('draggable')) {
            return; // то не запускаем перенос
        }
        let target = e.target;
        let coords = getCoords(target);
        mouseOffset = {x: e.pageX - coords.left, y: e.pageY - coords.top};
        dragObject = target;
        if(isTouchScreen) {
            document.ontouchmove = documentOnTouchMove;
            document.ontouchend = documentOnTouchEnd;
        }
        else {
            document.onmousemove = documentOnMouseMove;
            document.onmouseup = documentOnMouseUp;
        }
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
    }

    if(isTouchScreen) {
        document.ontouchstart = documentOnTouchStart;
    }
    else {
        document.onmousedown = documentOnMouseDown;
    }
    document.oncontextmenu = function (){return false};

    return {
        // addDragZone: addDragZone,
        addDragZones: addDragZones
    }

}