const Koa = require("koa");
const app = new Koa();
const stream = require('stream');

class StreamRender extends stream.Readable {

    constructor() {
        super()
        this.render();
    }

    _read() { }

    async render() {

        try {

            let html = await this.renderHTMLFramework();
            this.push(html)

            let card1 = this.renderCard1();
            let card2 = this.renderCard2();
            let card3 = this.renderCard3();


            this.push(await card1)
            this.push(await card2)
            this.push(await card3)

            this.push(`</body></html>`)
        } catch (e) {
        } finally {
            this.finish()
        }
    }

    finish() {
        this.push(null);
    }

    async renderHTMLFramework() {
        return `<!DOCTYPE html>
        <html lang='{{params.locale}}' dir="{{params.direction}}">
        <head>
            <meta charset="UTF-8">
            <meta name="referrer" content="origin">
            <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
            <title>Stream render</title>
        </head>
        <body>
        `
    }

    renderCard1() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`<div class="card">cards1</div>`)
            }, 10)
        })

    }

    renderCard2() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`<div  class="card">cards2</div>`)
            }, 3000)
        })
    }

    renderCard3() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`<div  class="card">cards3</div>`)
            }, 6000)
        })
    }
}



const main = ctx => {
    ctx.type = "text/html";

    // nginx使用：用于禁用proxy_buffering, nginx可以迅速将response返回客户端
    ctx.set('X-Accel-Buffering', 'no');
    ctx.body = new StreamRender();
}


app.use(main);
app.listen(3000);
console.log("http://localhost:3000")
