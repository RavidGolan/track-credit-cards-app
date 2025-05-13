import { Vendors } from '../common/enums/Vendors';
import IVendorService from "@Interfaces/IVendorService";
import {AmericanExpressService} from "./CreditCardsServices/AmericanExpressService";
import {MaxService} from "./CreditCardsServices/MaxService";
import {LeumiService} from "./CreditCardsServices/LeumiService";
import {IsracardService} from "./CreditCardsServices/IsracardService";

export const VendorServices: Record<Vendors, IVendorService> = {
    [Vendors.LEUMI]: new LeumiService(),
    [Vendors.MAX]:  new MaxService(),
    [Vendors.ISRACARD]:  new IsracardService(),
    [Vendors.AMERICAN_EXPRESS]: new AmericanExpressService(),
};
