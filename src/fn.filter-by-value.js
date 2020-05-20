import { pipe, reduce } from "@mutant-ws/m"

/**
 * Filter object keys by testing value
 *
 * @param {Function} fn Predicate
 *
 * @returns {Object}
 */
export const filterByValue = fn =>
  pipe(
    Object.entries,
    reduce(
      (acc, [key, value]) => (fn(value) ? { ...acc, [key]: value } : acc),
      {}
    )
  )
