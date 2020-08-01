const getResourceId = (id) => {
  const regex = /^([A-z0-9_-]+)\.[A-z]+$/;
  const match = id.match(regex);
  if (match) {
    return match[1];
  }
  return null;
};

module.exports = getResourceId;
