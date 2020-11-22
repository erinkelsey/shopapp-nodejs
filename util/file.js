const fs = require('fs')

/**
 * 
 * Delete a file from the /images folder. 
 * 
 * @param {String} filePath path of file to delete
 */
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw (err)
  })
}

exports.deleteFile = deleteFile