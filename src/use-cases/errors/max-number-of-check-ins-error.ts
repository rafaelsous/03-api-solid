export class MaxNumberCheckInsError extends Error {
  constructor() {
    super('Maximum number of check-ins reached')
  }
}
