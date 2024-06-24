const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Folder = require("../models/folderModel");

const filterObj = (obj, ...allowedFeilds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFeilds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.addFolder = catchAsync(async (req, res, next) => {
  const folderType = req.folderType;
  const { folderName } = req.body;
  const exsistingFolder = await Folder.findOne({
    name: folderName,
    user: req.user,
    type: folderType,
  });
  if (exsistingFolder) {
    exsistingFolder.content.push(req.item);
    await exsistingFolder.save();
  } else {
    const folder = await Folder.create({ name: folderName, user: req.user });
    if (!folder) {
      return next(new AppError("Folder not created", 404));
    }
    folder.content.push(req.item)
    folder.type = folderType;
    await folder.save();
  }
  res.status(201).json({
    status: "success",
    data: {
      item: req.item,
    },
  });
});

exports.renameFolder = catchAsync(async (req, res, next) => {
  const folderType = req.folderType;
  const { folderName } = req.body;
  const exsistingFolder = await Folder.findOne({
    name: folderName,
    user: req.user,
    type: folderType,
  });
  if (!exsistingFolder) {
      return next(new AppError("Folder not found", 404));
  }
  exsistingFolder.name=folderName;
  res.status(201).json({
    status: "success",
    data: {
      folder:exsistingFolder
    },
  });
});
exports.deleteFolder = catchAsync(async (req, res, next) => {
  const folderType = req.folderType;
  const { folderName } = req.body;
  const exsistingFolder = await Folder.findOne({
    name: folderName,
    user: req.user,
    type: folderType,
  });
  if (!exsistingFolder) {
      return next(new AppError("Folder not found", 404));
  }

  exsistingFolder.name=folderName;

  res.status(201).json({
    status: "success",
    data: {
      folder:exsistingFolder
    },
  });
});

exports.getAllFolders = catchAsync(async (req, res, next) => {
  const folders = await Folder.find({ user: req.user });
  if (!folders) {
    return next(new AppError("No folders found", 404));
  }
  req.folders = folders;
});

exports.getNoteFolders = catchAsync(async (req, res, next) => {
  const folders = await Folder.find({ user: req.user, type:"Note" }).populate(
    "content"
  );
  if (!folders) {
    return next(new AppError("No folders found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      folders,
    },
  });
});
exports.getCardFolders = catchAsync(async (req, res, next) => {
  const folders = await Folder.find({ user: req.user, type: "Card" }).populate(
    "content"
  );
  if (!folders) {
    return next(new AppError("No folders found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      folders,
    },
  });
});
exports.getAccountFolders = catchAsync(async (req, res, next) => {
  const folders = await Folder.find({ user: req.user, type: "Bank" }).populate(
    "content"
  );
  console.log(folders);
  if (!folders) {
    return next(new AppError("No folders found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      folders,
    },
  });
});
exports.getPasswordFolders = catchAsync(async (req, res, next) => {
  const folders = await Folder.find({ user: req.user, type: "Password" }).populate(
    "content"
  );
  if (!folders) {
    return next(new AppError("No folders found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      folders,
    },
  });
});
