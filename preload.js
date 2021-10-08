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
