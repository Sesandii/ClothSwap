const Clothes = require("../models/Clothes");

const getObjectId = (value) => {
  if (!value) {
    return "";
  }

  if (value._id) {
    return value._id.toString();
  }

  return value.toString();
};

const getOfferedOwnerId = (swapRequest) => {
  if (swapRequest.offeredOwner) {
    return getObjectId(swapRequest.offeredOwner);
  }

  return getObjectId(swapRequest.requester);
};

const getRequestedOwnerId = (swapRequest) => {
  if (swapRequest.requestedOwner) {
    return getObjectId(swapRequest.requestedOwner);
  }

  if (swapRequest.requestedClothes?.user) {
    return getObjectId(swapRequest.requestedClothes.user);
  }

  return "";
};

const transferCompletedSwapOwnership = async (swapRequest) => {
  if (!swapRequest || swapRequest.status !== "completed") {
    return;
  }

  const offeredClothesId = getObjectId(swapRequest.offeredClothes);
  const requestedClothesId = getObjectId(swapRequest.requestedClothes);
  const offeredOwnerId = getOfferedOwnerId(swapRequest);
  const requestedOwnerId = getRequestedOwnerId(swapRequest);

  if (!offeredClothesId || !requestedClothesId || !offeredOwnerId || !requestedOwnerId) {
    return;
  }

  await Promise.all([
    Clothes.findByIdAndUpdate(offeredClothesId, {
      $set: { user: requestedOwnerId, status: "swapped" },
    }),
    Clothes.findByIdAndUpdate(requestedClothesId, {
      $set: { user: offeredOwnerId, status: "swapped" },
    }),
  ]);
};

module.exports = {
  transferCompletedSwapOwnership,
};
