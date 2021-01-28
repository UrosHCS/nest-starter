// This is a helper file that makes it easier to work with context classes
import { E2EContext } from '../context/e2e.context'

export let ctx: E2EContext

/**
 * Just await this method in the beforeEach and grab the ctx reference
 */
export async function before(): Promise<void> {
  ctx = new E2EContext()
  await ctx.before()
}

export async function after(): Promise<void> {
  await ctx.after()
}
