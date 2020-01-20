import { Router } from 'express';
import SessionController from './app/controllers/SessionController';

import auth from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import CompanyController from './app/controllers/CompanyController';
import OccupationController from './app/controllers/OccupationController';
import ClientController from './app/controllers/ClientController';
import ToolController from './app/controllers/ToolController';
import StockControler from './app/controllers/StockControler';
import OrderController from './app/controllers/OrderController';
import OrderItemController from './app/controllers/OrderItemController';
import NotificationOrderController from './app/controllers/NotificationOrderController';

const routes = Router();

routes.post('/sessions', SessionController.store);

routes.use(auth);
// Users
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.destroy);

// Companies
routes.get('/companies', CompanyController.index);
routes.post('/companies', CompanyController.store);
routes.put('/companies/:id', CompanyController.update);
routes.delete('/companies/:id', CompanyController.destroy);

// Occupations
routes.get('/occupations', OccupationController.index);
routes.post('/occupations', OccupationController.store);
routes.put('/occupations/:id', OccupationController.update);
routes.delete('/occupations/:id', OccupationController.destroy);

// Clients
routes.get('/clients', ClientController.index);
routes.post('/clients', ClientController.store);
routes.get('/clients/:id', ClientController.show);
routes.put('/clients/:id', ClientController.update);
routes.delete('/clients/:id', ClientController.destroy);

// Tools
routes.get('/tools', ToolController.index);
routes.post('/tools', ToolController.store);
routes.get('/tools/:id', ToolController.show);
routes.put('/tools/:id', ToolController.update);
routes.delete('/tools/:id', ToolController.destroy);

// Stock
routes.get('/stocks', StockControler.index);
routes.post('/stocks', StockControler.store);
routes.put('/stocks/:id', StockControler.update);

// Orders Notifications
routes.get('/orders/notifications', NotificationOrderController.index);

// Orders
routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.create);
routes.get('/orders/:id', OrderController.show);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.destroy);

routes.get('/orders/:id/items', OrderItemController.index);
routes.post('/orders/:id/items', OrderItemController.create);
routes.put('/orders/:id/items/:item_id', OrderItemController.update);
routes.delete('/orders/:id/items/:item_id', OrderItemController.destroy);

export default routes;
