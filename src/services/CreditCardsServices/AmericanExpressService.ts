import ITransaction from "@Interfaces/ITransaction";
import {TransactionType} from "../../common/enums/TransactionType";
import ICreditCardIssuersService from "@Interfaces/ICreditCardIssuersService";
import {parseExcelFile} from "../ExcelUtils";

export class AmericanExpressService implements ICreditCardIssuersService {

    transformRawData(rawRows: any[]): ITransaction[] {
        return rawRows
            .filter(row => !isNaN(Number(row["__EMPTY_1"])) || !isNaN(Number(row["__EMPTY_2"])))
            .map(row => {
                if (!isNaN(Number(row["__EMPTY_1"]))) {
                    return {
                        transactionType: TransactionType.CONSTANT,
                        date: row["אמריקן אקספרס זהב - 5147"] || "",
                        vendor: row["__EMPTY"] || "",
                        amount: parseFloat(row["__EMPTY_1"]),
                        details: row["__EMPTY_6"] || "",
                        billedAmount: parseFloat(row["__EMPTY_3"]),
                    };
                } else {
                    return {
                        transactionType: TransactionType.CONSTANT,
                        date: row["אמריקן אקספרס זהב - 5147"] || "",
                        vendor: row["__EMPTY_1"] || "",
                        amount: parseFloat(row["__EMPTY_2"]),
                        billedAmount: parseFloat(row["__EMPTY_4"]),
                    };
                }

            });
    }

    async parseExcelFile(file: File): Promise<ITransaction[]> {
        return parseExcelFile(file, this.transformRawData);
    }

}
