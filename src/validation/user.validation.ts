/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */
import Joi, { ValidationResult } from 'joi';
import { IUserModel } from '../types';

export const registerValidation = (user: IUserModel): ValidationResult => {
  const regSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    userCreationDate: Joi.string(),
  });

  return regSchema.validate(user);
};

export const emailValidation = (email: string): ValidationResult => {
  return Joi.string().email().label('Email').validate(email);
};

export const loginValidation = (user: IUserModel): ValidationResult => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return loginSchema.validate(user);
};

export const walletInfoValidation = (reqBody: {
  address: string;
  token: string;
}): ValidationResult => {
  const walletInfoSchema = Joi.object({
    address: Joi.string().required(),
    token: Joi.string().required(),
  });

  return walletInfoSchema.validate(reqBody);
};

export const editProfileInfoValidation = (reqBody: {
  name: string;
  bio: string;
  email: string;
  userId: string;
  currentProfilePicture: Blob;
}): ValidationResult => {
  const editProfileInfoSchema = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().allow(''),
    bio: Joi.string().allow('').max(160),
    email: Joi.string().email(),
    currentProfilePicture: Joi.string().allow(''),
  });

  return editProfileInfoSchema.validate(reqBody);
};
