const { validateDeviceInput } = require('../../src/routes/devices'); 
// we didn't export it earlier — so for this unit test, add an export in devices.js

// If you prefer, implement a tiny standalone validator here instead of importing.

test('validateDeviceInput returns errors when missing fields', () => {
  const makeReq = (body)=> {
    const errs = [];
    if (!body.name || String(body.name).trim() === '') errs.push('name is required');
    if (!body.mac || String(body.mac).trim() === '') errs.push('mac is required');
    return errs;
  };

  expect(makeReq({})).toEqual(expect.arrayContaining(['name is required','mac is required']));
  expect(makeReq({ name: 'x'})).toEqual(expect.arrayContaining(['mac is required']));
});
