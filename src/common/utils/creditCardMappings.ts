import { CreditCards } from '../enums/CreditCards';
import {CreditCardIssuers} from "../enums/CreditCardIssuers";

export const CreditCardToIssuerMap: Record<CreditCards, CreditCardIssuers> = {
    [CreditCards.AMERICAN_EXPRESS]: CreditCardIssuers.AMERICAN_EXPRESS,
    [CreditCards.LEUMI]: CreditCardIssuers.LEUMI,
    [CreditCards.ISRACARD]: CreditCardIssuers.ISRACARD,
    [CreditCards.MAX]: CreditCardIssuers.MAX,
    [CreditCards.LIFE_STYLE]: CreditCardIssuers.ISRACARD,
};
