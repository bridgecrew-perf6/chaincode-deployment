import logger from '../core/logger/app-logger';


const { exec } = require('child_process');

const deploymentService = {};
deploymentService.deploy = async (req, res, name) => {
  logger.info('Deployment triggered');

  logger.info('running chaincode peer commands');

  exec(`cd /root/busy-network ; ./scripts/new-chaincode.sh ${name}v1 1 /root/chaincode-deployment/uploads/${name} ${name}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
};


export default deploymentService;
