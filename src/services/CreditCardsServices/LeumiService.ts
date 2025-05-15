import ITransaction from "@Interfaces/ITransaction";
import ICreditCardIssuersService from "@Interfaces/ICreditCardIssuersService";
import {parseExcelFile} from "../ExcelUtils";
import {TransactionType} from "../../common/enums/TransactionType";

export class LeumiService implements ICreditCardIssuersService {

    excelDateToISO(serial: number): string {
        const utc_days = Math.floor(serial - 25569); // Excel date to Unix date
        const utc_date = new Date(utc_days * 86400 * 1000);
        return utc_date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    formatDDMMYYToISO(dateStr: string): string {
        const [day, month, year] = dateStr.split('/');
        const fullYear = parseInt(year) < 50 ? '20' + year : '19' + year; // heuristic
        return `${fullYear}-${month}-${day}`;
    }

    transformRawData(rawRows: any[]): ITransaction[] {
        return rawRows
            .filter(row => row["בנק לאומי |"] && row["בנק לאומי |"] !== "תאריך העסקה" && row["__EMPTY_4"])
            .map(row => {
                const rawDate = row["בנק לאומי |"];
                let date: string;

                if (typeof rawDate === "number") {
                    date = this.excelDateToISO(rawDate); // handle Excel serial numbers
                } else if (/^\d{2}\/\d{2}\/\d{2}$/.test(rawDate)) {
                    date = this.formatDDMMYYToISO(rawDate); // handle "dd/mm/yy"
                } else {
                    date = rawDate; // fallback for unexpected formats
                }

                return {
                    transactionType: TransactionType.CHANGING,
                    date,
                    vendor: row["__EMPTY"] || "",
                    amount: parseFloat(row["__EMPTY_1"]) || 0,
                    type: row["__EMPTY_2"] || "",
                    details: row["__EMPTY_3"] || "",
                    billedAmount: parseFloat(row["__EMPTY_4"]) || 0,
                };
            });
    }

    async parseExcelFile(file: File): Promise<ITransaction[]> {
        return parseExcelFile(file, this.transformRawData.bind(this));
    }
}
