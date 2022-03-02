import mongoose from 'mongoose';
import logger from '../core/logger/app-logger';


const deploymentSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },

}, { collection: 'Deployment' });

const deploymentModel = mongoose.model('Deployment', deploymentSchema);

deploymentModel.getAll = () => {
  return deploymentModel.find({});
};

deploymentModel.deploymentExists = (deploymentName) => {
  return deploymentModel.findOne({ name: deploymentName });
};


deploymentModel.addDeployment = (deploymentToAdd) => {
  logger.info('Inside Model');
  return deploymentToAdd.save();
};

deploymentModel.removedeployment = (deploymentName) => {
  return deploymentModel.remove({ name: deploymentName });
};

export default deploymentModel;
