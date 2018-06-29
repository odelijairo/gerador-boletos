function merge(destination, source) {
  if (isUndefined(destination)) {
    destination = {};
  }

  if (isUndefined(source)) {
    source = {};
  }

  forEachOwnProperty(source, function(property, value) {
    destination[property] = value;
  });

  return destination;
}
module.exports.merge = merge;
