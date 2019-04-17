const danma = new DanMa('test', 15)

function shoot () {
  const content = document.getElementById('input').value
  danma.$receive({
    text: content,
    color: '#' + Math.floor(Math.random() * 0xffffff).toString(16)
  })
}

const productDm = function () {
  setInterval(function () {
    danma.$receive({
      text: '麦克克里斯保罗加索尔'.slice(0, Math.floor(Math.random() * 10)),
      color: '#' + Math.floor(Math.random() * 0xffffff).toString(16)
    })
  }, 100)
}

productDm()

document.getElementById('btn').addEventListener('click', shoot)