describe('the fuck out of it', function() {
    beforeEach(function() {
        browser().navigateTo('index.html');
    });

    it('should have 4 rows', function() {
        expect(repeater('tr.list', 'the list').count()).toBe(4);
    });

    it('should sort the list on a th click', function() {
        element('th:nth-child(2)').click();
        expect(element('tr.list:first td:nth-child(2)', 'the field').text()).toBe('23-456-789');
    });

    it('should re-sort the list on two th clicks', function() {
        element('th:nth-child(2)').click();
        element('th:nth-child(2)').click();

        expect(element('tr.list:last td:nth-child(2)', 'the field').text()).toBe('23-456-789');
    });


});
