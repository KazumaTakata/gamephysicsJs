import { Vector, Matrix2D } from 'mathjs'

class Canvas {
  constructor(ctx, center) {
    this.center = center
    this.ctx = ctx
    ctx.beginPath()
    ctx.lineTo(center.x, center.y)
    ctx.lineTo(center.x, center.y - 1000)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(center.x, center.y)
    ctx.lineTo(center.x + 1000, center.y)
    ctx.stroke()
  }
  beginPath() {
    this.ctx.beginPath()
  }

  lineTo(x, y) {
    this.ctx.lineTo(this.center.x + x, this.center.y - y)
  }
  stroke() {
    this.ctx.stroke()
  }
}

function SAT(rec1, rec2) {
  rec1.calcNormal()
  rec2.calcNormal()

  let ifcollision = true
  let normals = rec1.normal.concat(rec2.normal)

  let contactNormal
  let minLength = 10000000000
  let contactPoint

  for (let i = 0; i < normals.length; i++) {
    let whichNormal
    if (i > 1) {
      whichNormal = 2
    } else {
      whichNormal = 1
    }

    let normal = normals[i]
    let projected1 = []
    for (let j = 0; j < rec1.points.length; j++) {
      let point = rec1.points[j]
      projected1.push(point.dot(normal))
    }

    let projected2 = []
    for (let j = 0; j < rec2.points.length; j++) {
      let point = rec2.points[j]
      projected2.push(point.dot(normal))
    }

    let max1 = Math.max(...projected1)
    let max2 = Math.max(...projected2)

    let min1 = Math.min(...projected1)
    let min2 = Math.min(...projected2)

    let ifOverlap
    if (max1 > max2) {
      if (min1 < max2) {
        ifOverlap = true
        if (max2 - min1 < minLength) {
          minLength = max2 - min1
          contactNormal = normal
          if (whichNormal == 2) {
            let minIndex = projected1.indexOf(min1)
            contactPoint = { id: 1, index: minIndex }
          } else {
            let maxIndex = projected2.indexOf(max2)
            contactPoint = { id: 2, index: maxIndex }
          }
        }
      } else {
        ifOverlap = false
      }
    } else {
      if (min2 < max1) {
        ifOverlap = true
        if (max1 - min2 < minLength) {
          minLength = max1 - min2
          contactNormal = normal
          if (whichNormal == 2) {
            let minIndex = projected1.indexOf(min1)
            contactPoint = { id: 1, index: minIndex }
          } else {
            let maxIndex = projected2.indexOf(max2)
            contactPoint = { id: 2, index: maxIndex }
          }
        }
      } else {
        ifOverlap = false
      }
    }
    if (!ifOverlap) {
      ifcollision = false
    }
  }
  if (ifcollision) {
    console.log('collision!')
    return { normal: contactNormal, length: minLength, point: contactPoint }
  } else {
    console.log('not collision')
    return false
  }
}

class Rectangle {
  constructor(center, width, height, rotateAngle) {
    this.center = center
    this.height = height
    this.width = width
    this.rotateAngle = rotateAngle
    this.points = new Array(4)
    this.normal = []
  }

  calcNormal() {
    this.normal = []
    let normal = new Vector(2)
    let normal2 = new Vector(2)
    normal.set([Math.cos(this.rotateAngle), Math.sin(this.rotateAngle)])
    normal2.set([-Math.sin(this.rotateAngle), Math.cos(this.rotateAngle)])
    this.normal.push(normal)
    this.normal.push(normal2)
  }

  calcCorner() {
    let rotationMat = new Matrix2D(2, 2)
    let matValue = [
      [Math.cos(this.rotateAngle), -Math.sin(this.rotateAngle)],
      [Math.sin(this.rotateAngle), Math.cos(this.rotateAngle)]
    ]
    rotationMat.set(matValue)
    let points = new Array(4)
    for (let i = 0; i < 4; i++) {
      points[i] = new Vector(2)
    }

    points[0].set([-this.width, this.height])
    points[1].set([-this.width, -this.height])
    points[2].set([this.width, -this.height])
    points[3].set([this.width, this.height])
    for (let i = 0; i < 4; i++) {
      this.points[i] = rotationMat.mulVec(points[i]).add(this.center)
    }
  }

  draw(ctx) {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(this.points[i % 4].Value[0], this.points[i % 4].Value[1])
    }
    ctx.stroke()
  }
}

let canvas = document.getElementById('main')
if (!canvas) {
  console.log('Failed to retrieve the <canvas> element')
}

let center = new Vector(2)
center.set([20, 85])
let rec = new Rectangle(center, 20, 20, Math.PI / 5)
rec.calcCorner()

let center2 = new Vector(2)
center2.set([0, 0])
let rec2 = new Rectangle(center2, 50, 50, Math.PI / 10)
rec2.calcCorner()

var ctx = canvas.getContext('2d')
let myCtx = new Canvas(ctx, { x: 200, y: 500 })

rec.draw(myCtx)
rec2.draw(myCtx)

let contactInfo = SAT(rec, rec2)

console.log(contactInfo)
