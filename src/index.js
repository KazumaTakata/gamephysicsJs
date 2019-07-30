import { Vector, Matrix2D } from 'mathjs'
import { SAT } from '2dCollision'
import { Rectangle } from 'rectangle'
import { calcj } from './2dPhysics'

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
  clear(canvas) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

let canvas = document.getElementById('main')
if (!canvas) {
  console.log('Failed to retrieve the <canvas> element')
}

let center = new Vector(2)
center.set([10, 105])
let rec = new Rectangle(center, 20, 20, Math.PI / 5, 0.00001)
rec.calcCorner()

let center2 = new Vector(2)
center2.set([0, 0])
let rec2 = new Rectangle(center2, 20, 20, Math.PI / 10, 0.00001)
rec2.calcCorner()

var ctx = canvas.getContext('2d')
let myCtx = new Canvas(ctx, { x: 200, y: 500 })

rec.velocity.set([0, -40])
rec.angVelocity = Math.PI / 10

rec.draw(myCtx)
rec2.draw(myCtx)

let prevTime

function step(timestamp) {
  if (!prevTime) {
    prevTime = timestamp
  }
  let dt = (timestamp - prevTime) / 1000
  prevTime = timestamp
  let contactInfo = SAT(rec, rec2)
  if (contactInfo) {
    calcj(rec, rec2, contactInfo, 0.3)
  }

  console.log(contactInfo)
  rec.update(dt)
  rec2.update(dt)
  myCtx.clear(canvas)
  rec.draw(myCtx)
  rec2.draw(myCtx)

  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)

// let contactInfo = SAT(rec, rec2)

// console.log(contactInfo)

// calcj(rec, rec2, contactInfo, 0.5)
