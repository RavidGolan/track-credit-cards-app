import { CardIssuers } from '../common/enums/CardIssuers';
import ICreditCardService from "@Interfaces/ICreditCardService";
import {AmericanExpressService} from "./CreditCardsServices/AmericanExpressService";
import {MaxService} from "./CreditCardsServices/MaxService";
import {LeumiService} from "./CreditCardsServices/LeumiService";
import {IsracardService} from "./CreditCardsServices/IsracardService";

export const CreditCardsServices: Record<CardIssuers, ICreditCardService> = {
    [CardIssuers.LEUMI]: new LeumiService(),
    [CardIssuers.MAX]:  new MaxService(),
    [CardIssuers.ISRACARD]:  new IsracardService(),
    [CardIssuers.AMERICAN_EXPRESS]: new AmericanExpressService(),
};
