export default function isAllNull(obj: {}) {
  return Object.values(obj).every(value => value === null);
}