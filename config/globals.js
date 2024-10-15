global.fetchedData = null;

export const getFetchedData = () => global.fetchedData;
export const setFetchedData = (data) => {
  global.fetchedData = data;
};

export const addDeviceData = (data) => {
  global.fetchedData.push(data);
  return global.fetchedData;
};

export const updateExpiry=(loginId,expiry)=>{
  global.fetchedData = global.fetchedData.map((device) =>
    device.loginId === loginId ? { ...device, status: "ACTIVE", expiry: expiry } : device
  );
  return global.fetchedData;
}

export const deleteDeviceData = (data) => {
  global.fetchedData = global.fetchedData.filter((device) => device.mac !== data.mac);
};

export const updateDeviceData = (data) => {
  global.fetchedData = global.fetchedData.map((device) =>
    device.mac === data.mac ? data : device
  );
};
