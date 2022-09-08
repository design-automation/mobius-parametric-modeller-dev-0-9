const sharp = require('sharp');
const galleryConfig = require('./__config__.json').data;

function resizeImg(fileIn, fileOut) {
    sharp(fileIn).resize({ height:116, width:156}).toFile(fileOut).catch(ex => {
        console.log('~~~~~ Error', )
        console.log('      fileIn:', fileIn,)
        console.log('      fileOut:', fileOut, ex)
        console.log('      error:', ex)
    })
}

galleryConfig.forEach(section => {
    const link1 = section.link.replace('/assets/gallery', 'src/assets/gallery');
    section.files.forEach(file => {
        let link2;
        if (Array.isArray(file)) {
            link2 = file[0].split('.mob')[0];
        } else {
            link2 = file.split('.mob')[0];
        }
        const fileIn = link1 + 'imgs/' + link2 + '.JPG'
        const fileOut = link1 + 'imgs/' + link2 + '_resized.JPG'
        try {
            resizeImg(fileIn, fileOut);
        } catch (ex) {
            console.log('error resizing file '+ fileIn)
        }
    })
})
