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



interface AuthRequest extends Request {
  user?: { id: number };
}

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new ApiError('Unauthorized', ErrorCodes.UNAUTHORIZED.statusCode));
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ApiError('Current and new passwords are required.', ErrorCodes.BAD_REQUEST.statusCode));
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new ApiError('User not found.', ErrorCodes.NOT_FOUND.statusCode));
    }
    const storedPassword = user.get('password') as string;
    const isMatch = await bcrypt.compare(currentPassword, storedPassword);
    if (!isMatch) {
      return next(new ApiError('Current password is incorrect.', ErrorCodes.UNAUTHORIZED.statusCode));
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.set('password', hashedNewPassword);
    await user.save();

    logger.info(`User changed password: userId=${userId}`);

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    logger.error('Change password error', { error });
    return next(new ApiError('Failed to change password.', ErrorCodes.INTERNAL_SERVER_ERROR.statusCode));
  }
};
