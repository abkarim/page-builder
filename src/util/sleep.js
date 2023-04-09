/**
 * Stop code execution
 * @param {number} seconds
 * @returns Promise
 */
export default function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}
