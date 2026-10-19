// CAN Lab (Phase 6) glossary. Only terms the canlab unit introduces; everything else reuses
// existing ids (candump, savvycan, cabana, opendbc, motorola-byte-order, checksum, gateway, ...).
export default [
  { id: 'cycle-time', term: 'Cycle time', aka: ['GenMsgCycleTime', 'Send rate'], lessons: ['canlab-01', 'canlab-02'],
    def: 'How often a periodic message is sent, in milliseconds. In a DBC it’s the `GenMsgCycleTime` attribute, e.g. 20 ms = 50 frames per second.' },
  { id: 'bus-sleep', term: 'Bus sleep', aka: ['Network sleep', 'Low-power mode'], lessons: ['canlab-01'],
    def: 'When the key is off, modules stop sending and their CAN transceivers drop to a low-power standby to save the battery, until a wake-up (door, key fob, ignition) brings the bus back.' },
];
