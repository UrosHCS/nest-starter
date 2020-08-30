// This is a helper file that makes it easier to work with context classes
import { E2EContext } from '../context/e2e.context'

export let ctx: E2EContext

/**
 * Use this in beforeEach or before global functions
 */
export const setUp = async (): Promise<void> => {
  ctx = new E2EContext()
  await ctx.setUp()
}

/**
 * Use this in afterEach or after global functions
 */
export const tearDown = async (): Promise<void> => {
  await ctx.tearDown()
}
