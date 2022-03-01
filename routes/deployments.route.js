/* eslint-disable new-cap */
import express from 'express';
import carController from '../controllers/cars.controller';
import deploymentController from '../controllers/deployments.controller';
import logger from '../core/logger/app-logger';

const router = express.Router();

router.get('/all', (req, res) => {
  deploymentController.getAll(req, res);
});

router.post('/deploy', (req, res, next) => {
  logger.info('Reaced routes');
  deploymentController.deploy(req, res, next);
});

router.delete('/deletecar', (req, res) => {
  carController.deleteCar(req, res);
});

export default router;
