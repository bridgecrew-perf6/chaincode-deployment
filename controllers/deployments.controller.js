import Deployment from '../models/deployments.model';
import logger from '../core/logger/app-logger';
import deploymentService from '../services/deployment.service';

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const deployments = await Deployment.getAll();
    logger.info('sending all deployments...');
    res.send(deployments);
  } catch (err) {
    logger.error(`Error in getting deployments- ${err}`);
    res.send('Got error in getAll');
  }
};

controller.deploy = async (req, res, next) => {
  const deploymentToAdd = Deployment({
    name: req.body.name,
  });
  const deploymentName = req.body.name;
  try {
    logger.info('req.body');

    logger.info(req.body);


    const existingDeployment = await Deployment.deploymentExists(deploymentName);

    if (existingDeployment) { next(`Deployment already exists \n ${existingDeployment} `); } else {
      const savedDeployment = await Deployment.addDeployment(deploymentToAdd);
      logger.info('Adding deployment...');
      deploymentService.deploy(deploymentToAdd.name);
      res.send(`added: ${savedDeployment}`);
    }
  } catch (err) {
    logger.error(`Error in getting deployments- ${err}`);
    res.send(err);
  }
};

export default controller;
