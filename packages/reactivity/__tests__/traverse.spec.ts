import {
  reactive,
  ref,
  traverse,
  markRaw
} from '../src'

describe('reactivity/traverse', () => {
  test('should traverse nested objects', () => {
    const obj = reactive({ a: { b: 1 } })
    expect(traverse(obj)).toBe(obj)
  })

  test('should traverse arrays', () => {
    const arr = reactive([{ a: 1 }])
    expect(traverse(arr)).toBe(arr)
  })

  test('should traverse Refs', () => {
    const r = ref({ a: 1 })
    expect(traverse(r)).toBe(r)
  })

  test('should traverse Sets', () => {
    const s = reactive(new Set([{ a: 1 }]))
    expect(traverse(s)).toBe(s)
  })

  test('should traverse Maps', () => {
    const m = reactive(new Map([['a', { b: 1 }]]))
    expect(traverse(m)).toBe(m)
  })

  test('should handle circular references', () => {
    const obj: any = reactive({ a: 1 })
    obj.self = obj
    expect(traverse(obj)).toBe(obj)
  })

  test('should respect depth', () => {
    let count = 0
    const obj = reactive({
      get a() {
        count++
        return {
          get b() {
            count++
            return 1
          }
        }
      }
    })
    traverse(obj, 1)
    expect(count).toBe(1)
  })

  test('should skip marked objects', () => {
    const obj = reactive({ a: markRaw({ b: 1 }) })
    expect(traverse(obj)).toBe(obj)
  })

  test('should handle non-objects', () => {
    expect(traverse(1)).toBe(1)
    expect(traverse(null)).toBe(null)
    expect(traverse(undefined)).toBe(undefined)
  })

  test('should traverse symbol keys', () => {
    const s = Symbol()
    const obj = reactive({ [s]: { a: 1 } })
    expect(traverse(obj)).toBe(obj)
  })
})
