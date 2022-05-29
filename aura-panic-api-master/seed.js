const request = require('request');
const path = require('path');
const fs = require('fs');
const faker = require('faker');
const uuidv4 = require('uuid').v4;
const { writeFileSync } = require('jsonfile');

function createNestedDirectory(dirs) {
  let dirPath = __dirname;
  for (const dir of dirs) {
    dirPath = path.join(dirPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  }
  return dirPath;
}

const sleep = (duration) => new Promise(resolve => {
  setTimeout(() => resolve(), duration);
})

async function makeNearbyHealth() {
  const roles = ['Hospital', 'Ambulance', 'Doctor'];
  let dirPath, filePath, json = [];
  for (let i = 0; i < 10; i++) {
    const role = faker.random.arrayElement(roles);
    console.log(i, role);
    switch (role) {
      case 'Hospital':
        json.push({
          id: uuidv4(),
          role,
          address: faker.address.streetAddress(),
          phone: faker.phone.phoneNumber()
        });
        break;
      case 'Ambulance':
        json.push({
          id: uuidv4(),
          role,
          color: faker.vehicle.color(),
          model: faker.vehicle.model(),
          type: faker.vehicle.type(),
          vehicle: faker.vehicle.vehicle()
        });
        break;
      case 'Doctor':
        const id = uuidv4();
        dirPath = createNestedDirectory(['storage', 'nearby_health', id]);
        const fileName = uuidv4() + '.jpg';
        filePath = path.join(dirPath, fileName);
        const response = await request('https://thispersondoesnotexist.com/image');
        response.pipe(fs.createWriteStream(filePath));
        await sleep(1000);
        json.push({
          id,
          role,
          name: faker.name.findName(),
          avatar: `/storage/nearby_health/${id}/${fileName}`
        });
        break;
    }
  }
  dirPath = createNestedDirectory(['storage']);
  filePath = path.join(dirPath, 'nearby_health.json');
  writeFileSync(filePath, json, {
    spaces: 2,
    EOL: "\r\n"
  });
}

async function makeNearbySecurity() {
  const roles = ['Police Station', 'Police Car', 'Police'];
  let dirPath, filePath, json = [];
  for (let i = 0; i < 10; i++) {
    const role = faker.random.arrayElement(roles);
    console.log(i, role);
    switch (role) {
      case 'Police Station':
        json.push({
          id: uuidv4(),
          role,
          address: faker.address.streetAddress(),
          phone: faker.phone.phoneNumber()
        });
        break;
      case 'Police Car':
        json.push({
          id: uuidv4(),
          role,
          color: faker.vehicle.color(),
          model: faker.vehicle.model(),
          type: faker.vehicle.type(),
          vehicle: faker.vehicle.vehicle()
        });
        break;
      case 'Police':
        const id = uuidv4();
        dirPath = createNestedDirectory(['storage', 'nearby_security', id]);
        const fileName = uuidv4() + '.jpg';
        filePath = path.join(dirPath, fileName);
        const response = await request('https://thispersondoesnotexist.com/image');
        response.pipe(fs.createWriteStream(filePath));
        await sleep(1000);
        json.push({
          id,
          role,
          name: faker.name.findName(),
          avatar: `/storage/nearby_security/${id}/${fileName}`
        });
        break;
    }
  }
  dirPath = createNestedDirectory(['storage']);
  filePath = path.join(dirPath, 'nearby_security.json');
  writeFileSync(filePath, json, {
    spaces: 2,
    EOL: "\r\n"
  });
}

makeNearbyHealth();
makeNearbySecurity();
