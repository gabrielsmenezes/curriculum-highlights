
export abstract class OperationPacketBuilder {
  public static getPacket(operation: Operation, serviceOrder: ServiceOrder, relig: equipment, crib?: equipment): GenericPacket {
    switch (operation.shortname) {
    case "H": {
      return new AtualizarUCeBlowfish(operation, serviceOrder, relig);
    }

    case "I": {
      return new AtualizarChaveSSLPublica(operation, serviceOrder, relig);
    }

    case "K": {
      return new AtualizarChaveSSLPrivada(operation, serviceOrder, relig);
    }

    case "C": {
      return new Cortar(operation, serviceOrder, relig);
    }

    case "R": {
      return new Religar(operation, serviceOrder, relig);
    }

    case "S": {
      return new AcenderLED(operation, serviceOrder, relig);
    }

    case "T": {
      return new EnviarCredito(operation, serviceOrder, relig);
    }

    case "L": {
      return new Leitura(operation, serviceOrder, relig);
    }

    case "N": {
      return new ConfigurarMacCrib(operation, serviceOrder, relig, crib);
    }
    }
  }
}
