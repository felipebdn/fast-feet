import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return right('success')
  } else {
    return left('error')
  }
}

test('success result', () => {
  const result = doSomething(true)
  expect(result.value).toEqual('success')
  expect(result.isRight()).toBe(true)
})

test('error result', () => {
  const result = doSomething(false)
  expect(result.value).toEqual('error')
  expect(result.isLeft()).toBe(true)
})
