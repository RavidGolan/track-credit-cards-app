import { CreditCardIssuers } from '../common/enums/CreditCardIssuers';
import ICreditCardIssuersService from "@Interfaces/ICreditCardIssuersService";
import {AmericanExpressService} from "./CreditCardsServices/AmericanExpressService";
import {MaxService} from "./CreditCardsServices/MaxService";
import {LeumiService} from "./CreditCardsServices/LeumiService";
import {IsracardService} from "./CreditCardsServices/IsracardService";

export const CreditCardsServices: Record<CreditCardIssuers, ICreditCardIssuersService> = {
    [CreditCardIssuers.LEUMI]: new LeumiService(),
    [CreditCardIssuers.MAX]:  new MaxService(),
    [CreditCardIssuers.ISRACARD]:  new IsracardService(),
    [CreditCardIssuers.AMERICAN_EXPRESS]: new AmericanExpressService(),
};
