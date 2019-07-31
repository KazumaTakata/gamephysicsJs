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
center.set([0, 105])
let rec = new Rectangle(center, 20, 20, (Math.PI / 5) * 0, 0.1)
rec.calcCorner()

let center2 = new Vector(2)
center2.set([0, 0])
let rec2 = new Rectangle(center2, 30, 30, (Math.PI / 10) * 0, 0.1)
rec2.calcCorner()

let center3 = new Vector(2)
center3.set([10, 50])
let rec3 = new Rectangle(center3, 10, 10, (Math.PI / 10) * 0, 1.1)
rec3.calcCorner()

let center4 = new Vector(2)
center4.set([10, 70])
let rec4 = new Rectangle(center4, 10, 10, (Math.PI / 10) * 0, 1.1)
rec4.calcCorner()

let center5 = new Vector(2)
center5.set([10, -50])
let rec5 = new Rectangle(center5, 1000, 10, (Math.PI / 10) * 0, 1.1)
rec5.calcCorner()

var ctx = canvas.getContext('2d')
let myCtx = new Canvas(ctx, { x: 200, y: 500 })

rec.velocity.set([0, -100])
rec.angVelocity = Math.PI / 1000

let prevTime

let objects = [rec, rec2, rec3, rec4, rec5]

let combinationId = []
for (let i = 0; i < objects.length; i++) {
  for (let j = i + 1; j < objects.length; j++) {
    combinationId.push([i, j])
  }
}

function step(timestamp) {
  if (!prevTime) {
    prevTime = timestamp
  }
  let dt = (timestamp - prevTime) / 1000
  prevTime = timestamp

  for (let i = 0; i < combinationId.length; i++) {
    let comb = combinationId[i]
    let obj1 = objects[comb[0]]
    let obj2 = objects[comb[1]]
    let contactInfo = SAT(obj1, obj2)
    if (contactInfo) {
      calcj(obj1, obj2, contactInfo, 0.0)
    }
  }

  for (let i = 0; i < objects.length; i++) {
    objects[i].update(dt)
  }

  myCtx.clear(canvas)
  for (let i = 0; i < objects.length; i++) {
    objects[i].draw(myCtx)
  }

  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
