//brakebanner
class BrakeBanner {
  constructor(selector) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xf0f0f0,
      resizeTo: window
    })
    document.querySelector(selector).appendChild(this.app.view)
    this.stage = this.app.stage //舞台
    this.loader = new PIXI.Loader()

    this.loader.add('btn.png', 'images/btn.png')
    this.loader.add('brake_bike.png', 'images/brake_bike.png')
    this.loader.add('brake_handlerbar.png', 'images/brake_handlerbar.png')
    this.loader.add('brake_lever.png', 'images/brake_lever.png')
    this.loader.add('btn_circle.png', 'images/btn_circle.png')
    this.loader.load()

    this.loader.onComplete.add(() => {
      this.show()
    })
  }

  show() {
    let actionButton = this.createActionButton()
    actionButton.x = actionButton.y = 300

    const bikeContainer = new PIXI.Container()

    bikeContainer.scale.x = bikeContainer.scale.y = 0.3
    const bikeImage = new PIXI.Sprite(
      this.loader.resources['brake_bike.png'].texture
    )
    bikeContainer.addChild(bikeImage)

    const bikeLeverBarImage = new PIXI.Sprite(
      this.loader.resources['brake_lever.png'].texture
    )
    bikeContainer.addChild(bikeLeverBarImage)

    bikeLeverBarImage.pivot.x = 455
    bikeLeverBarImage.pivot.y = 455
    bikeLeverBarImage.x = 722
    bikeLeverBarImage.y = 900

    const bikeHanderBarImage = new PIXI.Sprite(
      this.loader.resources['brake_handlerbar.png'].texture
    )

    bikeContainer.addChild(bikeHanderBarImage)

    this.stage.addChild(bikeContainer)


    actionButton.interactive = true
    actionButton.buttonMode = true
    actionButton.on('mousedown', () => {
      gsap.to(bikeLeverBarImage, {
        duration: 0.1,
        rotation: (Math.PI / 180) * -30
      })
      pause()
    })

    actionButton.on('mouseup', () => {
      gsap.to(bikeLeverBarImage, {
        duration: 0.3,
        rotation: 0
      })
      start()
    })

    const resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width
      bikeContainer.y = window.innerHeight - bikeContainer.height
    }
    resize()
    window.addEventListener('resize', resize)

    //创建粒子
    let particleContainer = new PIXI.Container()
    this.stage.addChild(particleContainer)

    particleContainer.pivot.x = window.innerWidth / 2
    particleContainer.pivot.y = window.innerHeight / 2
    particleContainer.x = window.innerWidth / 2
    particleContainer.y = window.innerHeight / 2
    particleContainer.rotation = (35 * Math.PI) / 180

    let particles = []
    const colors = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0x818181, 0x000000]
    for (let i = 0; i < 20; i++) {
      let gr = new PIXI.Graphics()
      gr.beginFill(colors[Math.floor(Math.random() * colors.length)])
      gr.drawCircle(0, 0, 6)
      gr.endFill()

      let pItem = {
        sx: Math.random() * window.innerWidth,
        sy: Math.random() * window.innerHeight,
        gr
      }
      gr.x = pItem.sx
      gr.y = pItem.sy
      particleContainer.addChild(gr)
      particles.push(pItem)
    }
    let speed = 0
    function loop() {
      speed += 0.5
      speed = Math.min(speed, 20)
      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i]
        pItem.gr.y += speed
        if (speed >= 20) {
          pItem.gr.scale.y = 20
          pItem.gr.scale.x = 0.05
        }
        if (pItem.gr.y > window.innerHeight) pItem.gr.y = 0
      }
    }

    function start() {
      speed = 0
      gsap.ticker.add(loop)
    }

    function pause() {
      gsap.ticker.remove(loop)

      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i]
        pItem.gr.scale.y = 1
        pItem.gr.scale.x = 1
        gsap.to(pItem.gr, {
          duration: 0.6,
          x: pItem.sx,
          y: pItem.sy,
          ease: 'elastic.out'
        })
      }
    }
    gsap.ticker.add(loop)
    this.stage.addChild(actionButton)
    //粒子 有多个颜色
    //向某一个角度持续移动
    //超出边界后回到顶部继续移动
    //按住鼠标停止
    //
  }
  createActionButton() {
    /** 创建一个按钮容器 */
    let actionButton = new PIXI.Container()

    /** 获取到按钮容器里面的元素 */
    let btnImage = new PIXI.Sprite(this.loader.resources['btn.png'].texture)
    let btnCircle = new PIXI.Sprite(
      this.loader.resources['btn_circle.png'].texture
    )
    let btnCircle2 = new PIXI.Sprite(
      this.loader.resources['btn_circle.png'].texture
    )

    /** 在按钮容器添加元素 */
    actionButton.addChild(btnImage)
    actionButton.addChild(btnCircle)
    actionButton.addChild(btnCircle2)

    /** 按钮容器里面的元素设置位置 */
    btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2
    btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2
    btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width / 2

    /** 按钮容器里面元素设置动画 */
    btnCircle.scale.x = btnCircle.scale.y = 0.8
    gsap.to(btnCircle.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 })
    gsap.to(btnCircle, { duration: 1, alpha: 1, alpha: 0, repeat: -1 })

    return actionButton
  }
}
