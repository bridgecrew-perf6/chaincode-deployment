import logger from '../core/logger/app-logger';

const { exec } = require('child_process');

const deploymentService = {};
deploymentService.deploy = async (fileName) => {
  logger.info('Deployment triggered');
  exec('cat *.js bad_file | wc -l', (err, stdout, stderr) => {
    if (err) {
          // node couldn't execute the command
      return;
    }

        // the *entire* stdout and stderr (buffered)
    logger.info(`stdout: ${stdout}`);
    logger.info(`stderr: ${stderr}`);
  });
};


export default deploymentService;
