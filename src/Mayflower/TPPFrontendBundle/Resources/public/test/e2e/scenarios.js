'use strict';

describe('tpp', function () {

    beforeEach(function () {
        browser().navigateTo('/test');
    });

    describe('tpp view', function () {

        it('should have 3 data rows', function () {
            expect(repeater('tr.list', 'list rows').count()).toBe(3);
        });

        it('should have 7 data columns', function () {
            expect(repeater('th.weekNumber', 'week columns').count()).toBe(7);
        });

        it('should sort the list by name as default sorting', function () {
            expect(element('tr:nth-child(2) td:nth-child(2)', 'first name in list').text()).toBe('Johannes');
            expect(element('tr:last-child td:nth-child(2)', 'last name in list').text()).toBe('Robin');
        });

        it('should reorder the list on th click', function () {
            element('th:nth-child(2)', 'name heading').click();

            expect(element('tr:nth-child(2) td:nth-child(2)', 'first name in list').text()).toBe('Robin');
            expect(element('tr:last-child td:nth-child(2)', 'last name in list').text()).toBe('Johannes');
        });

        it('should add a person to the list', function () {
            input('resource.name', 'Name input field').enter('Basti');
            element('#add-resource', 'Add button').click();

            expect(element('tr:nth-child(2) td:nth-child(2)', 'first name in list').text()).toBe('Basti');
            expect(repeater('tr.list', 'list rows').count()).toBe(4);
        })
    });

    describe('addTask', function () {

        it('should have 1 add button per table cell', function () {
            expect(repeater('td.tasks', 'tasks cell').count()).toBe(3 * 7);
        });

        it('should open modal on click on add-button', function () {
            element('button.add-task-button:first').click();
            sleep(0.1);
            expect(element('#task-modal').css('display')).toBe('block');
        });

        it('should close the modal and add the task to the table son submit', function () {
            input('task.title').enter('TPP');
            element('#task-submit').click();
            sleep(0.1);
            expect(element('#task-modal').css('display')).toBe('none');
            expect(element(".task:first .task-title").text()).toBe('TPP');
        });
    });
});

