import fs from 'fs';

export const readJSON = (file) => {
    const jsonString = fs.readFileSync(file)
    return JSON.parse(jsonString)
}

export const writeJSON = (file, obj) => {
    const jsonString = JSON.stringify(obj, null, 4)
    fs.writeFileSync(file, jsonString)
}
