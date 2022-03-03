import logger from '../core/logger/app-logger';

const util = require('util');
const multer = require('multer');

const maxSize = 2 * 1024 * 1024;

const { exec } = require('child_process');

const deploymentService = {};
deploymentService.deploy = async (req, res, fileName) => {
  logger.info('Deployment triggered');

  await uploadFileMiddleware(req, res);
  logger.info('running chaincode peer commands');

  exec('cd /root/busy-network ; ./scripts/new-chaincode.sh sc 1 /root/chaincode-deployment/simple-chaincode simplechcode', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

 
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../resources/deployments/');
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});
const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
}).single('file');

const uploadFileMiddleware = util.promisify(uploadFile);


export default deploymentService;
