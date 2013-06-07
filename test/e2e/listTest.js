describe('the fuck out of it', function() {
  beforeEach(function() {
    browser().navigateTo('src/index.html');
  });

  it('should have 3 rows', function() {
    //browser().navigateTo('#/');
    expect(repeater('div.list', 'the list').count()).toBe(3);
  });
});
