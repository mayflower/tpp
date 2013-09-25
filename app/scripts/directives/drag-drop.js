// adapted from http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html

angular.module(
    'dragDrop', []
).directive('draggable', function () {
    return function (scope, element) {
        var el = element[0];

        el.draggable = true;

        el.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.clearData('Text');
            e.dataTransfer.setData('Text', this.id);
            this.classList.add('drag');
            return false;
        }, false);

        el.addEventListener('dragend', function (e) {
            this.classList.remove('drag');
            return false;
        }, false);
    }
}).directive('droppable', function () {
    return {
        link: function (scope, element) {
            var el = element[0];
            el.addEventListener('dragover', function (e) {
                e.dataTransfer.dropEffect = 'move';
                if (e.preventDefault) e.preventDefault(); // allows us to drop
                this.classList.add('over');
                return false;
            }, false);

            el.addEventListener('dragenter', function (e) {
                this.classList.add('over');
                return false;
            }, false);

            el.addEventListener('dragleave', function (e) {
                this.classList.remove('over');
                return false;
            }, false);

            el.addEventListener('drop', function (e) {
                if (e.stopPropagation) e.stopPropagation();
                if (e.preventDefault) e.preventDefault();

                this.classList.remove('over');

                var item = document.getElementById(e.dataTransfer.getData('Text'));
                this.appendChild(item);

                // FIXME (Robin) coupled to tppDisplayCtrl
                scope.$apply(scope.drop(item, scope.week, scope.resource));

                return false;
            }, false);
        }
    }
});
