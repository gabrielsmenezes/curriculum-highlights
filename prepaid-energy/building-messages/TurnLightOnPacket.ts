import {GenericPacket} from "./GenericPacket";

export class TurnLightOnPacket extends GenericPacket {
  constructor(operation: Operation, serviceOrder: ServiceOrder, equipment: equipment) {
    super(operation, serviceOrder, equipment);
  }

  async execute(): Promise<string> {
    const packetHex = await this.buildHexMessage();
    return this.cryptoService.encrypt(packetHex, this.equipment.blowfishKey);
  }
}
