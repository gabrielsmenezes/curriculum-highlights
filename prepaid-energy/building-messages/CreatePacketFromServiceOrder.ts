import { getRepository } from "typeorm";
import {OperationPacketBuilder} from "./OperationPacketBuilder";

export class CreatePacketFromServiceOrder {
  public async execute(serviceOrder: ServiceOrder): Promise<PacketEntity[]> {
    try {
      const equipamentOutput = await new ResidenceService().getRelig(serviceOrder.residence.id);
      const equipament = await getRepository(Equipament).findOne(equipamentOutput.id);
      const packets: PacketEntity[] = [];

      for (const operation of serviceOrder.orderServiceType.operations) {
        const handler = OperationPacketBuilder.getPacket(operation, serviceOrder, equipament);
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
