/*
 * # Kadocoin License
 *
 * Copyright (c) 2021 Adamu Muhammad Dankore
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or <http://www.opensource.org/licenses/mit-license.php>
 */
import Joi, { ValidationResult } from 'joi';
import { ParsedQs } from 'qs';

export const blocksRouteValidation = (query: ParsedQs): ValidationResult => {
  const blocksRouteSchema = Joi.object().keys({
    start: Joi.number().allow(''),
    end: Joi.number().allow(''),
  });

  return blocksRouteSchema.validate(query);
};

export const getBlockByHashValidation = (hash: string): ValidationResult => {
  return Joi.string().required().label('hash').validate(hash);
};

export const getBlockByHeightValidation = (height: string): ValidationResult => {
  return Joi.number().required().label('height').validate(height);
};
