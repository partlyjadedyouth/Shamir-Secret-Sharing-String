const primeNumber = 95971

function modulo(a, m) {
  result = a % m
  return result < 0 ? result + m : result
}

function modInverse(a, m) {
  [a, m] = [Number(a), Number(m)]

  if (Number.isNaN(a) || Number.isNaN(m)) {
    return NaN
  }

  a = (a % m + m) % m
  if (!a || m < 2) {
    return NaN
  }

  const s = []
  let b = m
  while (b) {
    [a, b] = [b, a % b]
    s.push({ a, b })
  }
  if (a !== 1) {
    return NaN
  }

  let x = 1, y = 0
  for (let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)]
  }
  return (y % m + m) % m
}

function getRandomInt() {
  return Math.floor(Math.random() * (95971 + 1))
}

function IsExistX(shares, N, x) {
  for (let i = 0; i < N; i++) {
    if (shares[i][0] == x) {
      return true
    }
  }

  return false
}

function create(message, K, N) {
  const messageBuffer = new Buffer.from(message)
  const secrets = [...messageBuffer]
  const messageLen = secrets.length  
  
  const polynomials = new Array(messageLen).fill(0)
  for (let i = 0; i < messageLen; i++) {
    const polynomial = new Array(K).fill(0)
    polynomial[0] = secrets[i]
    for (let j = 1; j < K; j++) {
      polynomial[j] = getRandomInt()
    }
    polynomials[i] = polynomial
  }

  const shares = new Array(N)

  for (let i = 0; i < N; i++) {
    shares[i] = new Array(messageLen + 1)
    do {
      x = getRandomInt();
    } while (IsExistX(shares, i, x));
    
    shares[i][0] = x
    for (let j = 1; j < messageLen + 1; j++) {
      shares[i][j] = evaludatePolynomial(polynomials[j - 1], x)  
    }
  }
  
  return shares
}

function evaludatePolynomial(polynomial, x) {
  const last = polynomial.length - 1
  let result = polynomial[last]

  for (let i = last - 1; i >= 0; i--) {
    result = result * x
    result = result + polynomial[i]
    result = modulo(result, primeNumber)
  }

  return result
}

function combine(shares) {
  messageLen = shares[0].length - 1
  var buffer = new Buffer.alloc(messageLen)
  
  for (let j = 1; j < messageLen + 1; j++) {
    let secret = 0
    for (let i = 0; i < shares.length; i++) {
      const share = shares[i]
      const x = share[0]
      const y = share[j]

      let numerator = 1
      let denominator = 1

      for (let k = 0; k < shares.length; k++) {
        if (i != k) {
          numerator = numerator * -shares[k][0]
          numerator = modulo(numerator, primeNumber)

          denominator = denominator * (x - shares[k][0])
          denominator = modulo(denominator, primeNumber)
        }
      }

      inversed = modInverse(denominator, primeNumber)

      secret = secret + y * (numerator * inversed)
      secret = modulo(secret, primeNumber)
    }
    buffer[j-1] = secret
  }

  return buffer
}

const shares = create('Oh My God', 5, 10)
console.log(combine(shares.slice(1,6)).toString())
