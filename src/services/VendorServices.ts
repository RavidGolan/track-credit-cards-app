import { Vendors } from '../common/enums/Vendors';
import IVendorService from "@Interfaces/IVendorService";
import {AmericanExpressService} from "./AmericanExpressService";

export const VendorServices: Record<Vendors, IVendorService> = {
    [Vendors.LEUMI]: /* new LeumiService() */ null as any,
    [Vendors.MAX]: /* new MaxService() */ null as any,
    [Vendors.ISRACARD]: /* new IsracardService() */ null as any,
    [Vendors.AMERICAN_EXPRESS]: new AmericanExpressService(),
};
