(function ($, document, window, undefined) {
    "use strict";

    $(document).ready(function () {

        $("body").tooltip();

        $('#add-task-dialog').dialog({
            'title': 'Buchung',
            'submit': function () {
                if ($(this).data('edit')) {
                    var dialog = $("#add-task-dialog");
                    $.post('task/' + dialog.data('id'), {
                        'typ': 'edit',
                        'personId': dialog.data('person-id'),
                        'week': dialog.data('week'),
                        'title': $('#title').val(),
                        'information': $('#information').val()
                    }, function () {
                        window.location.reload();
                    });
                } else {
                    $.post('/task/', {
                        'personId': dialog.data('person-id'),
                        'week': dialog.data('week'),
                        'title': $('#title').val(),
                        'information': $('#information').val()
                    }, function () {
                        window.location.reload();
                    });
                }
            }
        });

        $(document).on('click', '.add-task', function () {
            var dialog = $('#add-task-dialog');

            dialog.dialog('show');
            dialog.data('time', $(this).data('time'));
            dialog.data('person-id', $(this).data('person-id'));
            dialog.data('edit', false);
        });

        $(document).on('dblclick', '.task', function () {
            $(this).find('.add-task').trigger('click');
        });

        $(document).on('dblclick', '.handle', function (event) {
            $(this).find('.edit-dispo').trigger('click');
            event.stopPropagation();
        });

        $('#copy-buchung-dialog').dialog({
            'title': 'Buchung kopieren/verschieben',
            'submit': function () {
                var date = $("#copy_tag").val().split('.');
                var tag = new Date(date[2], date[1] - 1, date[0]) / 1000;
                var old_tag = $(this).data('tag');
                var old_studio_id = $(this).data('studio-id');
                var old_nacht = $(this).data('nacht');
                var goto_ = $("#goto").is(':checked');
                $.post('inc/studioplan.ajax.php', {
                    "old_tag": old_tag,
                    "old_studio_id": old_studio_id,
                    "old_nacht": old_nacht,
                    "typ": $("#copy-buchung-typ :selected").val(),
                    "tag": tag,
                    "studio_id": $("#copy_studio_id :selected").val(),
                    "nacht": $("#copy_studio_id :selected").data('nacht'),
                    "id": $(this).data('id'),
                    "copy-person": $('#copy-person').prop("checked"),
                    "person1": $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-1').val() || "",
                    "person2": $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-2').val() || "",
                    "person3": $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-3').val() || "",
                    "person4": $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-4').val() || ""
                }, function (msg) {
                    if ($('#copy-person').prop("checked") && msg.confirm && confirm("Personen Ã¼berschreiben?")) {
                        $.post('inc/studioplan.ajax.php', {
                            "old_tag": old_tag,
                            "old_studio_id": old_studio_id,
                            "old_nacht": old_nacht,
                            "typ": $("#copy-buchung-typ :selected").val(),
                            "tag": tag,
                            "studio_id": $("#copy_studio_id :selected").val(),
                            "nacht": $("#copy_studio_id :selected").data('nacht'),
                            "id": $(this).data('id'),
                            "copy-person": $('#copy-person').prop("checked"),
                            "confirmed": true,
                            "person1": $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-1').val() || "",
                            "person2": $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-2').val() || "",
                            "person3": $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-3').val() || "",
                            "person4": $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-4').val() || ""
                        }, function (msg2) {
                            console.log(msg);
                            if (goto_) {
                                window.location.href = "studioplan_wochenplan.php?category=" + msg.cat +
                                    "&year=" + msg.year + "&kw=" + msg.week;
                            }
                        }, 'json');
                    } else if (goto_) {
                        window.location.href = "studioplan_wochenplan.php?category=" + msg.cat +
                            "&year=" + msg.year + "&kw=" + msg.week;
                    }
                }, 'json');
                if ($("#copy-buchung-typ :selected").val() === "move") {
                    $("#" + $(this).data('id')).remove();
                }

            },
            "cancel": function () {
                $('#copy-buchung-dialog').dialog('hide');
            },
            'defaultCancel': false
        });



        addDrag();

        $(".drop").droppable({
            drop: function (event, ui) {
                var tag = $(this).data('tag');
                var studio_id = $(this).data('studio-id');
                var nacht = $(this).data('nacht');
                var id = ui.draggable.attr('id');
                var typ,
                    copied;
                var old_parent = $("#" + id).parent();
                if (event.altKey) {
                    // change edit and delete id!!!! -> ajax!!
                    ui.draggable.clone().prependTo($(this));
                    copied = $(this).find('#' + id);
                    typ = 'copy';
                    addDrag();
                } else {
                    ui.draggable.prependTo($(this));
                    typ = 'move';
                }
                $.post('inc/studioplan.ajax.php', {
                    "typ": typ,
                    "tag": tag,
                    "studio_id": studio_id,
                    "nacht": nacht,
                    "id": id
                }, function (msg) {
                    if (typ === "copy") {
                        copied.attr('id', msg.id);
                        copied.find('.edit-dispo').data('id', msg.id);
                    }
                }, 'json');
                if ($('#copy-person').prop("checked")) {
                    var new_persons = [
                        $('#person-' + tag + '-' + studio_id + '-' + (nacht ? 1 : 0) + '-1'),
                        $('#person-' + tag + '-' + studio_id + '-' + (nacht ? 1 : 0) + '-2'),
                        $('#person-' + tag + '-' + studio_id + '-' + (nacht ? 1 : 0) + '-3'),
                        $('#person-' + tag + '-' + studio_id + '-' + (nacht ? 1 : 0) + '-4')
                    ];
                    var confirmation = false;
                    if (new_persons[0].val() || new_persons[1].val() || new_persons[2].val() || new_persons[3].val()) {
                        confirmation = true;
                    }
                    if (!confirmation || confirm("Personen Ã¼berschreiben?")) {
                        var old_tag = old_parent.data("tag");
                        var old_studio_id = old_parent.data("studio-id");
                        var old_nacht = old_parent.data("nacht");
                        var old_persons = [
                            $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-1'),
                            $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-2'),
                            $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-3'),
                            $('#person-' + old_tag + '-' + old_studio_id + '-' + (old_nacht ? 1 : 0) + '-4')
                        ];
                        for (var i = 0; i < 4; ++i) {
                            new_persons[i].val(old_persons[i].val());
                            $.post("inc/studioplan.ajax.php", {
                                'time': tag,
                                'raum': studio_id,
                                'feld': i + 1,
                                'text': old_persons[i].val(),
                                'nacht': nacht,
                                'typ': "person"
                            });
                            if (typ === "move") {
                                $.post("inc/studioplan.ajax.php", {
                                    'time': old_tag,
                                    'raum': old_studio_id,
                                    'feld': i + 1,
                                    'text': '',
                                    'nacht': old_nacht,
                                    'typ': "person"
                                });
                                old_persons[i].val('');
                            }
                        }
                    }
                }
            }
        });

        $(document).on('click', '.delete-dispo', function () {
            var eintrag = $(this).parents(".drag");
            $.post("inc/studioplan.ajax.php", {
                "typ": "delete",
                "id": eintrag.attr('id')
            });
            eintrag.remove();
        });

        $(document).on('click', ".edit-dispo", function () {
            var eintrag = $(this).parents(".drag");
            var that = this;

            $('#new-buchung-dialog').data('edit', true);
            $('#new-buchung-dialog').data('id', $(this).data('id'));
            $('#fnr').val($(this).data('fnr'));
            $('#fnr').data('fnr_id', $(this).data('fnr-id'));
            $('#titel').val($(this).data('titel'));
            $('#kunde').val($(this).data('kunde'));
            $('#infos').val($(this).data('infos'));
            $('#art option').each(function () {
                if ($(this).val() == $(that).data('art').toLowerCase()) {
                    $(this).attr('selected', '');
                    return false;
                }
            });
            if ($(this).data('dauer') === "GanztÃ¤gig") {
                $('#ganz').attr('checked', '');
                $('#dauerp').hide();
            } else {
                $('#ganz').removeAttr('checked');
                $('#dauerp').show();
                $('#dauer').val($(this).data('dauer'));
            }

            $("#new-buchung-dialog").dialog('show');
            // openwin('buchen.php?edit=1&kw='+kw+'&cat='+cat+'&year='+year+'&id='+eintrag.attr('id'));
        });

        $(document).on('click', '.copy-dispo', function () {
            var that = this;
            $.each($('#copy_studio_id option'), function () {
                if ($(this).val() == $(that).data('studio-id') && $(that).data('nacht') == $(that).data('nacht')) {
                    $(this).attr('selected', '');
                    return false;
                }
            });
            $('#copy-buchung-dialog').data('id', $(this).data('id'));
            $('#copy-buchung-dialog').data('studio-id', $(this).data('studio-id'));
            $('#copy-buchung-dialog').data('nacht', $(this).data('nacht'));
            $('#copy-buchung-dialog').data('tag', $(this).data('tag'));
            $('#copy-buchung-dialog').dialog('show');
        });

        $("#ganz").on('change', function () {
            if ($("#ganz").is(":checked")) {
                $("#dauerp").slideUp();
            } else {
                $("#dauerp").slideDown();
            }
        });

        $("#searchform").on('submit', function () {
            $.post('inc/studioplan.ajax.php', {
                typ: 'search',
                search: $("#search").val()
            }, function (msg) {
                $("#search-content").html(msg);
                $("#search-dialog").dialog('show');
            });
            return false;
        });

        $('#search-dialog').dialog({
            'title': 'Suche',
            'submitButton': false
        });
    });

    function addDrag() {
        // $(".drag").draggable("destroy");
        $(".drag").draggable({
            addClasses: false,
            stack: ".drag",
            handle: '.handle',
            helper: 'clone',
            zIndex: 5
        });
    }
})(jQuery, document, window);
