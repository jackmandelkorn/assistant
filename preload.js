const runC = (code, callback) => {
  let s = JSON.stringify(code).substring(1)
  s = s.substring(0, s.length - 1)
  fetch("https://api.labstack.com/run", {
    "headers": {
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryYpraQpNA8MYhQ1Lb",
    },
    "body": ('------WebKitFormBoundaryYpraQpNA8MYhQ1Lb\r\nContent-Disposition: form-data; name=\"program\"\r\n\r\n{\"notes\":\"\",\"stack\":{\"name\":\"c\",\"version\":\"17\",\"description\":\"\",\"packages\":[],\"display\":\"C\",\"run_command\":\"./code\",\"compile_command\":\"gcc -std=gnu17 -o code code.c\",\"input\":\"code.c\",\"code\":\"#include <stdio.h>\\n\\nint main()\\n{\\n  printf(\\\"Hello from C!\\\");\\n  return 0;\\n}\\n\",\"text\":\"C (17)\"},\"content\":\"#include <stdio.h>\\n\\nint main()\\n{\\n  ' + s + '\\n  return 0;\\n}\\n\",\"input\":\"\"}\r\n------WebKitFormBoundaryYpraQpNA8MYhQ1Lb--\r\n'),
    "method": "POST",
  }).then(r => r.json()).then(r => callback(r.stdout))
}

const bitwiseOP = (variables, compute, callback) => {
  let s = variables
  if (variables.charAt(variables.length - 1) !== ";") {
    s += ";"
  }
  /*
  for (let variable of variables) {
    s += "int " + variable[0] + " = " + variable[1] + "; "
  }*/
  s += ("int RES = " + compute + "; ")
  s += ("printf(\"%x\\n\", RES);")
  runC(s, callback)
}

const compute6 = () => {
  document.getElementById("result-6").innerHTML = "Loading..."
  bitwiseOP(
    document.getElementById("variables-6").value.trim(),
    document.getElementById("compute-6").value.trim(),
    (r) => {
      try {
        document.getElementById("result-6").innerHTML = "0x" + r.trim().toUpperCase().padStart(8, "0")
      }
      catch (e) {
        document.getElementById("result-6").innerHTML = "Error."
      }
    }
  )
}

const getSign = (bin) => {
  if (bin.charAt(0) === "0") {
    return "+"
  }
  return "-"
}

const getExponent = (bin) => {
  let s = bin.substr(1,5)
  return (parseInt(s, 2) - 15)
}

const getFraction = (bin) => {
  let s = bin.substr(6,6)
  let n = 0
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) === "1") {
      n += (1 / Math.pow(2, i + 1))
    }
  }
  return n
}

const getDecimal = (bin) => {
  let sign = getSign(bin)
  let exponent = getExponent(bin)
  let fraction = getFraction(bin)
  let add = ""
  if (sign === "-") {
    add = sign
  }
  return (add + ((1 + fraction) * Math.pow(2, exponent)).toString())
}

const compute2_1 = () => {
  let bin = document.getElementById("number-2-1").value.trim().replace(/\s/g, '')
  let t = ("Sign: " + getSign(bin) + "<br>Exponent: " + getExponent(bin) + "<br>Fraction: " + getFraction(bin) + "<br>Decimal: " + getDecimal(bin))
  document.getElementById("result-2-1").innerHTML = t
}

const getDecSign = (dec) => {
  if (dec.toString().charAt(0) === "-") {
    return "-"
  }
  return "+"
}

const getDecExN = (dec) => {
  let n = Math.abs(dec)
  let exponent = 0
  if (n < 1) {
    while (n < 1) {
      n *= 2
      exponent--
    }
    return [exponent, n]
  }
  else {
    while (n > 2) {
      n /= 2
      exponent++
    }
    return [exponent, n]
  }
}

const getDecNormal = (dec) => {
  const max = 32
  let [exponent, n] = getDecExN(dec)
  let dots = ""
  if (n.toString(2).substring(0,max).length < n.toString(2).length) {
    dots = "..."
  }
  if (needsNormalization(dec)) {
    exponent++
  }
  return (getDecSign(dec) + n.toString(2).substring(0,max) + dots + " &times; 2^" + exponent.toString())
}

const getDecExponent = (dec) => {
  let [exponent, n] = getDecExN(dec)
  if (needsNormalization(dec)) {
    exponent++
  }
  return (exponent + 15).toString(2).padStart(5, "0")
}

const needsNormalization = (dec) => {
  const all_ones = "111111"
  let [exponent, n] = getDecExN(dec)
  let bits = n.toString(2).substr(2,6)
  let add = n.toString(2).substring(8)
  if (add.charAt(0) === "0") {
    return false
  }
  if (!add.substring(1).includes("1")) {
    if (bits.charAt(5) === "0") {
      return false
    }
    else {
      if (bits === all_ones) {
        return true
      }
      return false
    }
  }
  else {
    if (bits === all_ones) {
      return true
    }
    return false
  }
}

const getDecFraction = (dec) => {
  const all_ones = "111111"
  const all_zeroes = "000000"
  let [exponent, n] = getDecExN(dec)
  let bits = n.toString(2).substr(2,6)
  let add = n.toString(2).substring(8)
  if (add.charAt(0) === "0") {
    return bits
  }
  if (!add.substring(1).includes("1")) {
    if (bits.charAt(5) === "0") {
      return bits
    }
    else {
      if (bits === all_ones) {
        return all_zeroes
      }
      return (parseInt(bits,2) + 1).toString(2).padStart(6, "0")
    }
  }
  else {
    if (bits === all_ones) {
      return all_zeroes
    }
    return (parseInt(bits,2) + 1).toString(2).padStart(6, "0")
  }
}

const compute2_2 = () => {
  let dec = document.getElementById("number-2-2").value.trim().replace(/\s/g, '')
  let sign = "0"
  if (getDecSign(dec) === "-") {
    sign = "1"
  }
  let t = ("Normal Notation: " + getDecNormal(dec) + "<br>Sign Bit: " + sign + "<br>Exponent: " + getDecExponent(dec) + "<br>Fraction: " + getDecFraction(dec))
  document.getElementById("result-2-2").innerHTML = t
}

const compute1_1 = () => {
  const dec = document.getElementById("number-1-1").value.trim().replace(/\s/g, '')
  document.getElementById("result-1-1").innerHTML = Math.abs(dec).toString(2)
}

const compute1_2 = () => {
  const dec = parseInt(document.getElementById("number-1-2").value.trim().replace(/\s/g, ''))
  if (dec < 0) {
    document.getElementById("result-1-2").innerHTML = ("1" + Math.abs(dec + 128).toString(2).padStart(7, "0"))
  }
  else {
    document.getElementById("result-1-2").innerHTML = dec.toString(2).padStart(8, "0")
  }
}

const compute1_3 = () => {
  const bin = document.getElementById("number-1-3").value.trim().replace(/\s/g, '')
  document.getElementById("result-1-3").innerHTML = ("0x" + parseInt(bin,2).toString(16).toUpperCase())
}

const compute1_4 = () => {
  const bin = document.getElementById("number-1-4").value.trim().replace(/\s/g, '')
  if (bin.charAt(0) === "0") {
    document.getElementById("result-1-4").innerHTML = parseInt(bin, 2).toString()
  }
  else {
    document.getElementById("result-1-4").innerHTML = (parseInt(bin.substring(1), 2) - 128).toString();
  }
}

const compute1_5 = () => {
  const bin = document.getElementById("number-1-5").value.trim().replace(/\s/g, '')
  document.getElementById("result-1-5").innerHTML = parseInt(bin, 2).toString()
}
