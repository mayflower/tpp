describe('the fuck out of it', function() {
  beforeEach(function() {
    browser().navigateTo('index.html');
  });

  it('should have 3 rows', function() {
    expect(repeater('div.list', 'the list').count()).toBe(3);
  });
});
