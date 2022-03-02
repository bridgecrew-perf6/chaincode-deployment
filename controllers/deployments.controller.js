import Deployment from '../models/deployments.model';
import logger from '../core/logger/app-logger';
import deploymentService from '../services/deployment.service';

const fileUpload = require("express-fileupload");
const _ = require("lodash");

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



    const existingDeployment = await Deployment.deploymentExists(deploymentName);

    if (existingDeployment) { next('Deployment already exists '+ existingDeployment); } else {
      const savedDeployment = await Deployment.addDeployment(deploymentToAdd);

      try {
        if (!req.files) {
          res.send({
            status: false,
            message: "No file uploaded",
          });
        } else {
          const data = [];
    
          // logger.info(req.files.chaincodes)
          // loop all files
          _.forEach(_.keysIn(req.files.chaincodes), (key) => {
            const photo = req.files.chaincodes[key];
    
            // move photo to uploads directory
            photo.mv(`./uploads/${photo.name}`);
    
            // push file details
            data.push({
              name: photo.name,
              mimetype: photo.mimetype,
              size: photo.size,
            });
          });
    
          // return response
          res.send({
            status: true,
            message: "Files are uploaded, Deployment triggered",
            data,
          });
        }
      } catch (err) {
        logger.error(err);
         res.status(500).send(err);
      }
    



      logger.info('Adding deployment...');
      deploymentService.deploy(req, res, deploymentToAdd.name);
      // res.send(`added: ${savedDeployment}`);
    }
  } catch (err) {
    logger.error(`Error in getting deployments- ${err}`);
    // res.send(err);
  }
};

export default controller;
