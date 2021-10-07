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

const compute1 = () => {
  document.getElementById("result-1").innerHTML = "Loading..."
  bitwiseOP(
    document.getElementById("variables-1").value.trim(),
    document.getElementById("compute-1").value.trim(),
    (r) => {
      try {
        document.getElementById("result-1").innerHTML = "0x" + r.trim().toUpperCase().padStart(8, "0")
      }
      catch (e) {
        document.getElementById("result-1").innerHTML = "Error."
      }
    }
  )
}
