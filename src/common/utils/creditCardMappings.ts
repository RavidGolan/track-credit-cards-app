import {CreditCards} from '../enums/CreditCards';
import {CreditCardIssuers} from "../enums/CreditCardIssuers";

export const CreditCardToIssuerMap: Record<CreditCards, CreditCardIssuers> = {
    [CreditCards.AMERICAN_EXPRESS]: CreditCardIssuers.AMERICAN_EXPRESS,
    [CreditCards.LEUMI]: CreditCardIssuers.LEUMI,
    [CreditCards.ISRACARD]: CreditCardIssuers.ISRACARD,
    [CreditCards.MAX]: CreditCardIssuers.MAX,
    [CreditCards.LIFE_STYLE]: CreditCardIssuers.ISRACARD,
    [CreditCards.ONE_ZERO]: CreditCardIssuers.ISRACARD
};

export const CreditCardToNumberMap: Record<CreditCards, number> = {
    [CreditCards.AMERICAN_EXPRESS]: 5147,
    [CreditCards.LEUMI]: 9432,
    [CreditCards.ISRACARD]: 6940,
    [CreditCards.MAX]: 2423,
    [CreditCards.LIFE_STYLE]: 3869,
    [CreditCards.ONE_ZERO]: 9456
};
