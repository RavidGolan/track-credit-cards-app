import ITransaction from "@Interfaces/ITransaction";

export default interface ICreditCardIssuersService {
    parseExcelFile(file: File): Promise<ITransaction[]>
}
