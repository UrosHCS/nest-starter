import * as test from 'japa'
test.group('without nest setup', () => {
  test('tests the most minimal thing', (assert) => {
    assert.isTrue(2 > 1)
  })
})
