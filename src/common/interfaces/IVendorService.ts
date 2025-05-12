import ITransaction from "@Interfaces/ITransaction";

export default interface IVendorService {
    parseExcelFile(file: File): Promise<ITransaction[]>
}
