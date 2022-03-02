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
  logger.info('peer chaincode install');
 
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
