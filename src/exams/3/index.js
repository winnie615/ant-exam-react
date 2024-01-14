/**
 * 第三题
 */
import { isEqual } from 'lodash-es'

// 核心用户请求
let _requestTime = 0
const requestProfile = (uid) => {
  // 这个方法的实现不能修改
  return Promise.resolve().then(() => {
    return new Promise((resolve) => {
      setTimeout(() => { resolve() }, 1000)
    }).then(() => {
      _requestTime++
      return {
        uid,
        nick: `nick-${uid}`,
        age: '18',
      }
    })
  })
}


// 在这里完成代码，进行requestUserProfile优化
// 在这里调用requestProfile
const max = 2
const promMap = new Map()
const fetchingPromise = []
const requestUserProfile = (uid) => {
  if (!promMap.has(uid)) {
    if (fetchingPromise.length < max) {
      const prom = requestProfile(uid).catch(() => {
        promMap.delete(uid)
      }).finally(() => {
        fetchingPromise.splice(fetchingPromise.indexOf(prom), 1)
      })
      promMap.set(uid, prom)
      fetchingPromise.push(prom)
    } else {
      return Promise.race(fetchingPromise).catch(() => { }).then(() => {
        return requestUserProfile(uid)
      })
    }
  }
  return promMap.get(uid)
}
/**
 * 以下为测试用例，无需修改
 */
const exam3 = async () => {
  try {
    const star = Date.now()
    const result = await Promise.all([
      requestUserProfile('1'),
      requestUserProfile('2'),
      requestUserProfile('3'),
      requestUserProfile('1'),
    ])

    if ((Date.now() - star) < 2000 || (Date.now() - star) >= 3000) {
      throw new Error('Wrong answer')
    }

    if (!isEqual(result, [
      {
        uid: '1',
        nick: 'nick-1',
        age: '18',
      },
      {
        uid: '2',
        nick: 'nick-2',
        age: '18',
      },
      {
        uid: '3',
        nick: 'nick-3',
        age: '18',
      },
      {
        uid: '1',
        nick: 'nick-1',
        age: '18',
      }
    ])) {
      throw new Error('Wrong answer')
    }

    return _requestTime === 3
  } catch (err) {
    console.warn('测试运行失败')
    console.error(err)
    return false
  }
}

export default exam3
