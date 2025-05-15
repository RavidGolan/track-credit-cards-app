import ITransaction from "@Interfaces/ITransaction";

export default interface ICreditCardIssuersService {
    transformRawData(rawRows: any[]): ITransaction[]
    parseExcelFile(file: File): Promise<ITransaction[]>
}
