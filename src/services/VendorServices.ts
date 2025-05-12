import { Vendors } from '../common/enums/Vendors';
import IVendorService from "@Interfaces/IVendorService";
import {AmericanExpressService} from "./AmericanExpressService";
import {MaxService} from "./MaxService";
import {LeumiService} from "./LeumiService";
import {IsracardService} from "./IsracardService";

export const VendorServices: Record<Vendors, IVendorService> = {
    [Vendors.LEUMI]: new LeumiService(),
    [Vendors.MAX]:  new MaxService(),
    [Vendors.ISRACARD]:  new IsracardService(),
    [Vendors.AMERICAN_EXPRESS]: new AmericanExpressService(),
};
