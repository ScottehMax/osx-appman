"use strict";

let title = `                                                              
  ___   ___ __  __       __ _  _ __   _ __   _ __ ___    __ _  _ __  
 / _ \\ / __|\\ \\/ / ____ / _\` || '_ \\ | '_ \\ | '_ \` _ \\  / _\` || '_ \\
| (_) |\\__ \\ >  < |____| (_| || |_) || |_) || | | | | || (_| || | | |
 \\___/ |___//_/\\_\\      \\__,_|| .__/ | .__/ |_| |_| |_| \\__,_||_| |_|
                              | |    | |                             
                              |_|    |_|                             `


console.log(title);

const fs = require('fs');
const path = require('path');

var Sips = require('sips'); // not used yet, going to use this to convert to .png
const plist = require('simple-plist');


function analyseFiles(loc, files) {
    var fixedFiles = files.map(x => x.replace('.app', ''));
    for (let file in fixedFiles) {
        let filename = files[file]; // nb this has .app appended

        let infoLoc = path.join(loc, filename, 'Contents', 'Info.plist');
        let info = plist.readFileSync(infoLoc);
        let iconFileName = info['CFBundleIconFile'];
        let appname = info['CFBundleName'] !== undefined ? info['CFBundleName'] : fixedFiles[file];

        console.log(` * ${appname}`);

        if (iconFileName !== undefined) {
            let icfn = iconFileName.endsWith('.icns') ? iconFileName : iconFileName + '.icns';
            console.log( `   - ${icfn}` );
        } else {
            console.log ( '   - No icon, using default' );
        }
    }
}



var filesOnDisk, filesOnDrive;
filesOnDisk = fs.readdirSync('/Applications').filter(filename => filename.endsWith('.app'));
try {
    // hardcoded, fix this
    filesOnDrive = fs.readdirSync('/Volumes/PASSPORT/Applications').filter(filename => filename.endsWith('.app'));
} catch (e) {
    //console.log(e);
    filesOnDrive = [];
}

console.log('Files on disk:');
analyseFiles('/Applications', filesOnDisk);

console.log('-------------------------');
console.log('Files on drive:');
// hardcoded here too
analyseFiles('/Volumes/PASSPORT/Applications', filesOnDrive);