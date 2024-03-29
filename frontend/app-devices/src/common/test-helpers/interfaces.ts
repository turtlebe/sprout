import { FarmDefInterface } from '@plentyag/core/src/farm-def/types';

export const buildHathorInterface = function (deviceLocationPath: string): FarmDefInterface {
  return {
    class: 'Interface',
    description: null,
    kind: 'interface',
    methods: {
      ClearLuminaireFaults: {
        description: 'Trigger from FarmOS to Hathor for acknowledging or clearing of latched fault.',
        kind: 'method',
        name: 'ClearLuminaireFaults',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/ClearLuminaireFaults`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.ClearLuminaireFaults',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.ClearLuminaireFaults',
        responseProtoMessageFullName: null,
        type: 'trigger',
      },
      CommandDevice: {
        description: 'Request for general operations',
        kind: 'method',
        name: 'CommandDevice',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/CommandDevice`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.CommandDevice',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.CommandDevice',
        responseProtoMessageFullName: null,
        type: 'trigger',
      },
      CommandDfu: {
        description: 'Trigger for controlling the DFU process',
        kind: 'method',
        name: 'CommandDfu',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/CommandDfu`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.CommandDfu',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.CommandDfu',
        responseProtoMessageFullName: null,
        type: 'trigger',
      },
      CommandSprinkles: {
        description: 'Trigger from FarmOS to Hathor for commanding a Sprinkle or group of Sprinkles.',
        kind: 'method',
        name: 'CommandSprinkles',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/CommandSprinkles`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.CommandSprinkles',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.CommandSprinkles',
        responseProtoMessageFullName: null,
        type: 'trigger',
      },
      DeviceConnected: {
        description: 'Tell published immediately after connection, can also be requested with CommandDevice',
        kind: 'method',
        name: 'DeviceConnected',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/DeviceConnected`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.DeviceConnected',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.DeviceConnected',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      DeviceRebooted: {
        description: 'Tell notifying the reboot of a device.',
        kind: 'method',
        name: 'DeviceRebooted',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/DeviceRebooted`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.DeviceRebooted',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.DeviceRebooted',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      DfuStatusUpdated: {
        description: 'DFU status tell',
        kind: 'method',
        name: 'DfuStatusUpdated',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/DfuStatusUpdated`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.DfuStatusUpdated',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.DfuStatusUpdated',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      GetVGLuminaireIds: {
        description: 'Trigger for retrieving the current list of connected vertical grow luminaire ids',
        kind: 'method',
        name: 'GetVGLuminaireIds',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/GetVGLuminaireIds`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.GetVGLuminaireIds',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.GetVGLuminaireIds',
        responseProtoMessageFullName: null,
        type: 'trigger',
      },
      HealthCheckResponse: {
        description: 'The healthcheck response sent by lighting controller',
        kind: 'method',
        name: 'HealthCheckResponse',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/HealthCheckResponse`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.HealthCheckResponse',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.HealthCheckResponse',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      LuminaireFaultsUpdated: {
        description: 'Tell published whenever any lighting fault is triggered.',
        kind: 'method',
        name: 'LuminaireFaultsUpdated',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/LuminaireFaultsUpdated`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.LuminaireFaultsUpdated',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.LuminaireFaultsUpdated',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      LuminaireFeedback: {
        description: 'Tell sent periodically to FarmOS',
        kind: 'method',
        name: 'LuminaireFeedback',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/LuminaireFeedback`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.LuminaireFeedback',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.LuminaireFeedback',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      LuminaireIntensity: {
        description: 'Tell send as response/confirmation to a SetLightIntensity message',
        kind: 'method',
        name: 'LuminaireIntensity',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/LuminaireIntensity`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.LuminaireIntensity',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.LuminaireIntensity',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      SetLightIntensity: {
        description: 'Commands a lighting controller to output the requested setpoints',
        kind: 'method',
        name: 'SetLightIntensity',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/SetLightIntensity`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.SetLightIntensity',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.SetLightIntensity',
        responseProtoMessageFullName: null,
        type: 'trigger',
      },
      SprinklesDFUStatusUpdated: {
        description: 'Tell from Hathor to FarmOS to convey the results of a Sprinkles DFU job.',
        kind: 'method',
        name: 'SprinklesDFUStatusUpdated',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/SprinklesDFUStatusUpdated`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.SprinklesDFUStatusUpdated',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.SprinklesDFUStatusUpdated',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      SprinklesFaultsUpdated: {
        description: 'Tell from Hathor to FarmOS whenever any sensor fault is triggered. Faults are cumulative.',
        kind: 'method',
        name: 'SprinklesFaultsUpdated',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/SprinklesFaultsUpdated`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.SprinklesFaultsUpdated',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.SprinklesFaultsUpdated',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      SprinklesInfoUpdated: {
        description: 'Tell published to convey Sprinkles device information back to the service.',
        kind: 'method',
        name: 'SprinklesInfoUpdated',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/SprinklesInfoUpdated`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.SprinklesInfoUpdated',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.SprinklesInfoUpdated',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
      UpdateSprinklesDeviceList: {
        description:
          'Trigger for notifying Hathor on connection to the broker or when a change on the backend occurs regarding the list of Sprinkles associated with it',
        kind: 'method',
        name: 'UpdateSprinklesDeviceList',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/UpdateSprinklesDeviceList`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.UpdateSprinklesDeviceList',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.UpdateSprinklesDeviceList',
        responseProtoMessageFullName: null,
        type: 'trigger',
      },
      VGLuminaireIdsUpdated: {
        description: 'Tell published in response to trigger GetVGLuminaireIds',
        kind: 'method',
        name: 'VGLuminaireIdsUpdated',
        parentEntityPath: deviceLocationPath,
        parentPath: `${deviceLocationPath}/interfaces/Hathor`,
        path: `${deviceLocationPath}/interfaces/Hathor/methods/VGLuminaireIdsUpdated`,
        protoMessageDescriptor: null,
        protoMessageFullName: 'plenty.farmos.api.rpc.VGLuminaireIdsUpdated',
        protocol: {
          mqtt: {
            qos: 1,
            version: 0,
          },
          ropc1: null,
          ropc2: null,
        },
        requestProtoMessageFullName: 'plenty.farmos.api.rpc.VGLuminaireIdsUpdated',
        responseProtoMessageFullName: null,
        type: 'tell',
      },
    },
    name: 'Hathor',
    parentPath: `${deviceLocationPath}`,
    path: `${deviceLocationPath}/interfaces/Hathor`,
    properties: {},
    ref: '71d87dbc-ed2a-4bd5-a971-6c397e448231:interface-Hathor',
  };
};
