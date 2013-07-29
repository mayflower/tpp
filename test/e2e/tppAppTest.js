describe('tppApp', function () {

  beforeEach(function () {
    browser().navigateTo('index.html');
  });

  it('should have 6 data rows', function () {
    expect(repeater('tr.list', 'list rows').count()).toBe(6);
  });

  it('should sort the list by name as default sorting', function () {
    expect(element('tr:nth-child(2) td:first-child', 'first name in list').text()).toBe('Johannes');
    expect(element('tr:last-child td:first-child', 'last name in list').text()).toBe('Simon');
  });

  it('should resort the list on th click', function () {
    element('th:first-child', 'name heading').click();

    expect(element('tr:nth-child(2) td:first-child', 'first name in list').text()).toBe('Simon');
    expect(element('tr:last-child td:first-child', 'last name in list').text()).toBe('Johannes');
  });

});
