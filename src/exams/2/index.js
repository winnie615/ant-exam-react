import { isEqual } from 'lodash-es'

/**
 * 第二题
 */

// 核心用户请求
let _requestTime = 0
const requestUserInfo = () => {
  // 这个方法的实现不能修改
  return Promise.resolve().then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟 ajax 异步，1s 返回
        resolve()
      }, 1000)
    }).then(() => {
      _requestTime++
      return {
        nick: 'nick',
        age: '18',
      }
    })
  })
}

// -------- 在这里完成代码 优化getUserInfo --------
// 调用 requestUserInfo，并优化请求次数
// 把promise实例缓存下来，每次都返回第一次的实例，也就是只执行第一次的requestUserInfo ，后续都是返回同一个promise
const wrapper = () => {
  let fetchingPromise
  return () => {
    if (!fetchingPromise) {
      fetchingPromise = requestUserInfo().catch(() => {
        fetchingPromise = null
      })
    }
    return fetchingPromise
  }
}
const getUserInfo = wrapper()
// () => {
// 这个代码的问题在于，如果第一次失败了，之后就不会再重新请求，都是失败了
// return getUserInfo.promise ||= requestUserInfo()

// }

/**
 * 以下为测试用例，无需修改
 */
const exam2 = async () => {
  try {
    // 模拟请求
    const result = await Promise.all([
      getUserInfo(),
      new Promise((resolve) => setTimeout(async () => { resolve(await getUserInfo()) }, 300)),
      new Promise((resolve) => setTimeout(async () => { resolve(await getUserInfo()) }, 2300)),
    ])

    if (!isEqual(result, [
      {
        nick: 'nick',
        age: '18',
      },
      {
        nick: 'nick',
        age: '18',
      },
      {
        nick: 'nick',
        age: '18',
      },
    ])) {
      throw new Error('Wrong answer')
    }
    return _requestTime === 1
  } catch (err) {
    console.warn('测试运行失败')
    console.error(err)
    return false
  }
}

export default exam2
