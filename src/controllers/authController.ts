import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { ApiError } from '../utils/errors/ApiError';
import { ErrorCodes } from '../utils/errors/ErrorCodes';
import logger from '../logger/winstonLogger';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ApiError('Email already exists.', ErrorCodes.BAD_REQUEST.statusCode));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, phone, password: hashedPassword });

    const userData = newUser.toJSON();
    if (userData.password) delete (userData as any).password; 

    logger.info(`User signed up: ${email}`);

    return res.status(201).json({ message: 'User created', user: userData });
  } catch (error) {
    logger.error('Signup error', { error });
    return next(new ApiError('Failed to sign up.', ErrorCodes.INTERNAL_SERVER_ERROR.statusCode));
  }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new ApiError('Invalid email or password.', ErrorCodes.UNAUTHORIZED.statusCode));
    }

    const storedPassword = user.get('password') as string;
    const isPasswordValid = await bcrypt.compare(password, storedPassword);

    if (!isPasswordValid) {
      return next(new ApiError('Invalid email or password.', ErrorCodes.UNAUTHORIZED.statusCode));
    }

    const token = jwt.sign({ id: user.get('id') }, JWT_SECRET, { expiresIn: '1h' });

    const userData = user.toJSON();
    if (userData.password) delete (userData as any).password; 

    logger.info(`User logged in: ${email}`);

    return res.status(200).json({ message: 'Login successful', token, user: userData });
  } catch (error) {
    logger.error('Login error', { error });
    return next(new ApiError('Failed to login.', ErrorCodes.INTERNAL_SERVER_ERROR.statusCode));
  }
};
