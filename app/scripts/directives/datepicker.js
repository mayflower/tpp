/**
 * Created by robin on 9/18/13.
 */

angular.module(
    'datepicker', []
).directive('datepicker', function () {

    function putObject(path, object, value) {
        var modelPath = path.split(".");

        function fill(object, elements, depth, value) {
            var hasNext = ((depth + 1) < elements.length);
            if (depth < elements.length && hasNext) {
                if (!object.hasOwnProperty(modelPath[depth])) {
                    object[modelPath[depth]] = {};
                }
                fill(object[modelPath[depth]], elements, ++depth, value);
            } else {
                object[modelPath[depth]] = value;
            }
        }

        fill(object, modelPath, 0, value);
    }

    return function (scope, element, attrs) {
        element.datepicker({
            inline: true,
            dateFormat: 'dd.mm.yy',
            onSelect: function (dateText) {
                var modelPath = $(this).attr('ng-model');
                putObject(modelPath, scope, dateText);
                scope.$apply();
            }
        });
    }
});
