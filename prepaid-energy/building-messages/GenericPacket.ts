export abstract class GenericPacket {
  operation: Operation;
  serviceOrder: ServiceOrder;
  equipament: Equipament;
  cryptoService: CryptoService;

  protected constructor(operation: Operation, serviceOrder: ServiceOrder, equipament: Equipament) {
    this.operation = operation;
    this.serviceOrder = serviceOrder;
    this.equipament = equipament;
    this.cryptoService = new CryptoService();
  }


  public buildHexMessage(...args: string[]): Promise<string> {
    const executer = this.serviceOrder.pessoaExecutante;
    const residence = this.serviceOrder.residence;
    const operatorCode = this.strToHex(executer.personType[0].shortname);
    const operationHex = this.strToHex(this.operation.shortname);
    const userId = this.convertToHex(String(executer.id), 4);
    const uc = this.convertToHex(residence.uc, 4);
    const dateTime = this.convertToHex(this.formatDate(new Date()), 12);
    const firmwareVersion = this.floatToHex(this.equipament.versaoSw, 4);
    const serialNumber = this.equipament.MAC.padStart(6, "0").toUpperCase();
    const phase = this.convertToHex(residence.phase, 1);

    let response = Buffer.from("[").toString("hex");
    response += operatorCode;
    response += operationHex;
    response += userId;
    response += uc;
    response += dateTime;
    response += phase;
    response += firmwareVersion;
    response += serialNumber;
    response += Buffer.from("]").toString("hex");

    return Promise.resolve(this.padStart(response));
  }
  abstract execute(): Promise<string>;

  public strToHex(key: string): string {
    return Buffer.from(key).toString("hex").toUpperCase();
  }

  convertToHex(value: string, bytes: number): string {
    const valueAsNumber = Number(value);
    const hex = valueAsNumber.toString(16);
    return hex.padStart((bytes * 2), "0").toUpperCase();
  }

  formatDate(date: Date) {
    const isoDate = date.toISOString();
    const splitT = isoDate.split("T");
    const data = splitT[0];
    const day = data.split("-")[2];
    const month = data.split("-")[1];
    const year = data.split("-")[0];
    const hours = splitT[1];
    const hour = Number(hours.split(":")[0]) - 4;
    const minute = hours.split(":")[1];
    return day + month + year + hour + minute;
  }

  floatToHex(x: number, y: number) {
    // Convert the float number to hexadecimal
    const byteArray = new ArrayBuffer(y);
    const dataView = new DataView(byteArray);
    switch (y) {
    case 4:
      dataView.setFloat32(0, x, false);
      break;
    case 8:
      dataView.setFloat64(0, x, false);
      break;
    default:
      throw new Error("Unsupported number of bytes.");
    }

    // Convert the byte array to hexadecimal string
    let hexString = "";
    for (let i = 0; i < y; i++) {
      const byteValue = dataView.getUint8(i);
      const hexByte = byteValue.toString(16).padStart(2, "0");
      hexString += hexByte;
    }

    return hexString;
  }

  protected padStart(str: string) {
    // while (str.length % 8 !== 0) {
    // str = "0" + str;
    // }
    return str;
  }
}
