const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of felipetodev', () => {
  const result = palindrome('felipetodev')

  expect(result).toBe('vedotepilef')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
