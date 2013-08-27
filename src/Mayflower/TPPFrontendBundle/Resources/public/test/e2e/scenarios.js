'use strict';

describe('tpp', function () {

    beforeEach(function () {
        browser().navigateTo('/test');
    });

    it('should have 3 data rows', function () {
        expect(repeater('tr.list', 'list rows').count()).toBe(3);
    });

    it('should sort the list by name as default sorting', function () {
        expect(element('tr:nth-child(2) td:first-child', 'first name in list').text()).toBe('Johannes');
        expect(element('tr:last-child td:first-child', 'last name in list').text()).toBe('Robin');
    });

    it('should reorder the list on th click', function () {
        element('th:first-child', 'name heading').click();

        expect(element('tr:nth-child(2) td:first-child', 'first name in list').text()).toBe('Robin');
        expect(element('tr:last-child td:first-child', 'last name in list').text()).toBe('Johannes');
    });

    it('should add a person to the list', function () {
        input('resource.name', 'Name input field').enter('Basti');
        element('#add-resource', 'Add button').click();

        expect(element('tr:nth-child(2) td:first-child', 'first name in list').text()).toBe('Basti');
        expect(repeater('tr.list', 'list rows').count()).toBe(4);
    })

});