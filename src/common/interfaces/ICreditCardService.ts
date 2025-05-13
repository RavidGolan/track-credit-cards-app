import ITransaction from "@Interfaces/ITransaction";

export default interface ICreditCardService {
    parseExcelFile(file: File): Promise<ITransaction[]>
}
