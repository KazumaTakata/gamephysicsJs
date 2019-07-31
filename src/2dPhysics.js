import { Vector, Matrix2D } from 'mathjs'

function calcj(rect1, rect2, contactInfo, coff) {
  let normal = contactInfo.normal
  if (contactInfo.point.id == 1) {
  }
  let Wratio = rect1.weight / (rect1.weight + rect2.weight)
  let contactPoint
  if (contactInfo.point.id == 1) {
    contactPoint = rect1.points[contactInfo.point.index]
    if (normal.dot(rect2.center.sub(contactPoint)) > 0) {
      normal = normal.scalaMul(-1)
    }

    let velo1 = rect1.velocity.dot(normal) * -1
    let velo2 = rect2.velocity.dot(normal)

    let Wration = velo2 / (velo1 + velo2)

    // let Wratio = rect2.weight / (rect1.weight + rect2.weight)
    rect1.center = rect1.center.add(
      normal.scalaMul((1 - Wratio) * contactInfo.length)
    )
    rect2.center = rect2.center.add(
      normal.scalaMul(-Wratio * contactInfo.length)
    )
  } else {
    contactPoint = rect2.points[contactInfo.point.index]
    if (normal.dot(rect1.center.sub(contactPoint)) > 0) {
      normal = normal.scalaMul(-1)
    }
    let velo2 = rect2.velocity.dot(normal) * -1
    let velo1 = rect1.velocity.dot(normal)

    let Wration = velo2 / (velo1 + velo2)

    rect2.center = rect2.center.add(
      normal.scalaMul(Wratio * contactInfo.length)
    )
    rect1.center = rect1.center.add(
      normal.scalaMul(-(1 - Wratio) * contactInfo.length)
    )
  }
  let ra = contactPoint.sub(rect1.center)
  let rb = contactPoint.sub(rect2.center)
  let relVelocity = rect1.velocity.sub(rect2.velocity).dot(normal)

  if (ra.length == 2) {
    let tmpVec = new Vector(3)
    tmpVec.set([ra.Value[0], ra.Value[1], 0])
    ra = tmpVec
  }
  if (rb.length == 2) {
    let tmpVec = new Vector(3)
    tmpVec.set([rb.Value[0], rb.Value[1], 0])
    rb = tmpVec
  }

  if (normal.length == 2) {
    let tmpVec = new Vector(3)
    tmpVec.set([normal.Value[0], normal.Value[1], 0])
    normal = tmpVec
  }

  let Ra = ra
    .crossProduct(normal)
    .scalaMul(1 / rect1.I)
    .crossProduct(ra)
  let Rb = rb
    .crossProduct(normal)
    .scalaMul(1 / rect2.I)
    .crossProduct(rb)

  if (normal.length == 3) {
    let tmpVec = new Vector(2)
    tmpVec.set([normal.Value[0], normal.Value[1]])
    normal = tmpVec
  }

  let denomi =
    1 / rect1.weight + 1 / rect2.weight + normal.dot(Ra) + normal.dot(Rb)
  let j = (-(1 + coff) * relVelocity) / denomi

  rect1.velocity = rect1.velocity.add(normal.scalaMul(j / rect1.weight))
  rect2.velocity = rect2.velocity.add(normal.scalaMul(-j / rect2.weight))

  if (normal.length == 2) {
    let tmpVec = new Vector(3)
    tmpVec.set([normal.Value[0], normal.Value[1], 0])
    normal = tmpVec
  }

  let angZ = ra.crossProduct(normal).scalaMul(j / rect1.I)
  rect1.angVelocity = rect1.angVelocity + angZ.Value[2]

  let angZ2 = rb.crossProduct(normal).scalaMul(-j / rect2.I)
  rect2.angVelocity = rect2.angVelocity + angZ2.Value[2]
}

export { calcj }
