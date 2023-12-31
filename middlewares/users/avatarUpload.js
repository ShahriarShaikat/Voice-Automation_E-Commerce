const uploader = require("../../utilities/singleUploader.js");

function avatarUpload(req, res, next) {
  const upload = uploader(
    "avatars",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpg, jpeg or .png format allowed!"
  );

  // call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      console.log(err.message);
      // res.render("registration", {
      //   data: {},
      //   errors: {
      //     avatar: {
      //       msg: err.message,
      //     },
      //   },
      // });
      res.locals.errors = {
        avatar: {
          msg: err.message,
        },
      };
      //throw createError(err.message);
      //res.locals.errors.avatar = { msg: err.message };
      next();
    } else {
      next();
    }
  });
}

module.exports = avatarUpload;
