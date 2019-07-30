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
            let maxIndex = projected1.indexOf(max1)
            contactPoint = { id: 1, index: maxIndex }
          } else {
            let minIndex = projected2.indexOf(min2)
            contactPoint = { id: 2, index: minIndex }
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

export { SAT }
