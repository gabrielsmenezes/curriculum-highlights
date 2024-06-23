import {GenericPacket} from "./GenericPacket";

export class TurnLightOnPacket extends GenericPacket {
  constructor(operation: Operation, serviceOrder: ServiceOrder, equipament: Equipament) {
    super(operation, serviceOrder, equipament);
  }

  async execute(): Promise<string> {
    const packetHex = await this.buildHexMessage();
    return this.cryptoService.encrypt(packetHex, this.equipament.blowfishKey);
  }
}
