import { getRepository } from "typeorm";
import {OperationPacketBuilder} from "./OperationPacketBuilder";

export class CreatePacketFromServiceOrder {
  public async execute(serviceOrder: ServiceOrder): Promise<PacketEntity[]> {
    try {
      const equipmentOutput = await new ResidenceService().getRelig(serviceOrder.residence.id);
      const equipment = await getRepository(equipment).findOne(equipmentOutput.id);
      const packets: PacketEntity[] = [];

      for (const operation of serviceOrder.orderServiceType.operations) {
        const handler = OperationPacketBuilder.getPacket(operation, serviceOrder, equipment);
        const packet = new PacketEntity();
        packet.dado = await handler.execute();
        packet.serviceOrder = serviceOrder;
        packet.operation = operation.nome;
        packets.push(packet);
      }
      return packets;
    } catch (e) {
      console.log(e);
    }
  }
}
