import { Vector, Matrix2D } from 'mathjs'

class Rectangle {
  constructor(center, width, height, rotateAngle, rho) {
    this.center = center
    this.height = height
    this.width = width
    this.weight = rho * this.height * this.width * 4
    this.rotateAngle = rotateAngle
    this.points = new Array(4)
    this.velocity = new Vector(2)
    this.velocity.zero()
    this.angVelocity = 0
    this.normal = []
    this.I = undefined
    this.calcMomentOfInertia()
  }

  update(dt) {
    this.updatePosition(dt)
    this.updaterotateAngle(dt)
    this.calcCorner()
    this.calcNormal()
  }

  updatePosition(dt) {
    this.center = this.center.add(this.velocity.scalaMul(dt))
  }

  updaterotateAngle(dt) {
    this.rotateAngle = this.rotateAngle + this.angVelocity * dt
  }

  calcMomentOfInertia() {
    this.I =
      (1 / 12) *
      this.weight *
      (2 * this.height * 2 * this.height + 2 * this.width * 2 * this.width)
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

export { Rectangle }
