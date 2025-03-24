const fs = require("fs").promises;

const deleteImage = async (userImagePath) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log("user image was deleted");
  } catch (err) {
    console.error("user image does not exist");
  }
  //USING PROMISES
  //   fs.access(userImagePath)
  //     .then(() => fs.unlink(userImagePath))
  //     .then(() => console.log("user image was deleted"))
  //     .catch((err) => console.error("user image does not exist"));
};

module.exports = deleteImage;
