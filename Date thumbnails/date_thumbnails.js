"use strict"

const fs = require('fs')
const path = require('path')
//const process = require('process')
const Canvas = require('canvas')
const { registerFont } = require('canvas')

function drawThumb(sourceDir, filename) {
    fs.readFile(sourceDir + '/' + filename, async function (err, data) {
        if (err) {
            console.error(err)
            return
        } else {
            const destDir = sourceDir + '/thumbs'
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir)
            }

            const img = await Canvas.loadImage(data)

            const canvas = Canvas.createCanvas(1280, 720)
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 1280, 720)

            ctx.lineWidth = 15
            ctx.strokeStyle = 'black'
            ctx.fillStyle = 'white'

            let months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']

            const text = parseInt(filename.substr(8, 2)) + ' ' + months[filename.substr(5, 2)-1] + ' ' + filename.substring(0, 4)
            ctx.font = '125px "VAG Rounded Std"'

            // Base the height off the largest date string I could think of
            const metrics = ctx.measureText("23 September 2024")
            const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
            const x = 50
            const y = height + 50
            ctx.strokeText(text, x, y)
            ctx.fillText(text, x, y)

            const buffer = canvas.toBuffer('image/jpeg')
            fs.writeFileSync(sourceDir + '/thumbs/' + filename.substring(0, 10) + '-thumb.jpg', buffer)
        }
    })
}

if (process.argv.length < 3) {
    console.log('Usage: node draw_thumbs.js <source directory>')
    process.exit()
} else {
    const sourceDir = process.argv[2]
    console.log('Source directory: ' + sourceDir)

    const scriptDir = __dirname
    console.log('Script directory: ' + scriptDir)
    registerFont(scriptDir + '/VAGRoundedStd-Light.otf', { family: 'VAG Rounded Std' })

    fs.readdir(sourceDir, function (err, files) {
        if (err) {
            console.error(err)
            return
        }

        files.forEach(function (file) {
            if (path.extname(file) === '.jpg') {
                console.log(file)
                drawThumb(sourceDir, file)
            }
        })
    })
}
