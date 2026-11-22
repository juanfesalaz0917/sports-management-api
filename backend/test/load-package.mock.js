exports.loadPackage = async function (packageName, context, loaderFn) {
  return loaderFn ? loaderFn() : require(packageName);
};
exports.loadPackageSync = function (packageName, context, loaderFn) {
  return loaderFn ? loaderFn() : require(packageName);
};
exports.loadPackageCached = function (packageName, context) {
  return require(packageName);
};
exports.tryLoadPackage = async function (packageName, loaderFn) {
  try {
    return loaderFn ? loaderFn() : require(packageName);
  } catch {
    return null;
  }
};
