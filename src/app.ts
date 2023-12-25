import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import routes from './app/routes';

const app: Application = express();

// cors
app.use(cors({ origin: 'http://localhost:3000/' }));
// cockie perser
app.use(cookieParser());

// body perser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// use routes
app.use('/api/v1', routes);

// globalErrorHandler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
   res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Not Found',
      errorMessages: [
         {
            path: req.originalUrl,
            message: 'API Not Found',
         },
      ],
   });
   next();
});

export default app;
