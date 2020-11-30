/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validPhone(rule, value, callback) {
  const mobileReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  if (value !== '' && !mobileReg.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}

export function validNonNegativeDecimal(rule, value, callback) {
  // 非负浮点数
  const numberReg = /^^\d+(\.\d+)?$/
  if (value !== '' && !numberReg.test(value)) {
    callback(new Error('请输入正确的数字（非负小数）'))
  } else {
    callback()
  }
}

export function validPassword(rule, value, callback) {
  // 数字和字母组成
  const passwordReg = /^[A-Za-z0-9]+$/
  if (value !== '' && !passwordReg.test(value)) {
    callback(new Error('密码应由数字或字母组成'))
  } else {
    callback()
  }
}

export function orgCode(rule, value, callback) {
  const orgCodeReg = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
  if (value !== '' && !orgCodeReg.test(value)) {
    callback(new Error('请输入正确的统一社会信用代码'))
  } else {
    callback()
  }
}

