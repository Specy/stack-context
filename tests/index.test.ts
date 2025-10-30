import { expect, test, vi, beforeEach, afterEach, describe } from 'vitest'
import { StackContext } from '../src'

// The types and function from your original code
type MyState = {
  a: number,
  b: number
}

function sum(){
  const state = StackContext.state<MyState>()
  const sum = state.a + state.b
  console.log(`The sum is: `, sum)
}

// Group the tests for better organization (optional but recommended)
describe('sum function with StackContext', () => {
  // Use a variable to hold the spy
  let consoleLogSpy: vi.SpyInstance

  // 1. Set up the spy before each test
  beforeEach(() => {
    // Spy on the global console.log and keep its original implementation
    consoleLogSpy = vi.spyOn(console, 'log')
  })

  // 2. Restore the original console.log after each test
  afterEach(() => { 
    // Remove the spy to avoid side effects in other tests
    consoleLogSpy.mockRestore()
  })

  // 3. The actual test
  test('should print the sum of a and b to the console', () => {
    // Run the code within the StackContext root
    StackContext.root(() => {
      sum()
    }, { a: 10, b: 20 })
    
    // Check that console.log was called
    expect(consoleLogSpy).toHaveBeenCalled()
    
    // Check the arguments passed to console.log
    // Note: The arguments will be exactly what was passed: 'The sum is: ', 30
    expect(consoleLogSpy).toHaveBeenCalledWith('The sum is: ', 30)
  })
})