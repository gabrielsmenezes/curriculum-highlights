import {GenericPacket} from "./GenericPacket";

export class SendCreditPacket extends GenericPacket {
  constructor(operation: Operation, serviceOrder: ServiceOrder, equipment: equipment) {
    super(operation, serviceOrder, equipment);
  }

  async execute(): Promise<string> {
    const packetHex = await this.buildHexMessage();
    return this.cryptoService.encrypt(packetHex, this.equipment.blowfishKey);
  }

  buildHexMessage(): Promise<string> {
    const residence = this.serviceOrder.residence;
    const operationType = this.strToHex(this.serviceOrder.executer.personType[0].shortname);
    const operationHex = this.strToHex(this.operation.shortname);
    let credits = Number(process.env.DEFAULT_VALUE);
    if (!(this.serviceOrder.kmhValue === null || this.serviceOrder.kmhValue === undefined)) {
      credits = this.serviceOrder.kmhValue;
    }
    const creditsInString = this.floatToHex(credits, 4);
    const uc = this.convertToHex(residence.uc, 4);
    const dateTime = this.convertToHex(this.formatDate(new Date()), 12);
    const phase = this.convertToHex(residence.phase, 1);
    const firmwareVersion = this.floatToHex(this.equipment.versaoSw, 4);
    const serialNumber = this.equipment.MAC.padStart(6, "0").toUpperCase();

    let response = Buffer.from("[").toString("hex");
    response += operationType;
    response += operationHex;
    response += creditsInString;
    response += uc;
    response += dateTime;
    response += phase;
    response += firmwareVersion;
    response += serialNumber;
    response += Buffer.from("]").toString("hex");
    return Promise.resolve(this.padStart(response));
  }
}
