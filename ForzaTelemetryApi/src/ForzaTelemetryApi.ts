import { RpmData, DirectionalData, TireData, CarInfo, Drivetrain, CarClass } from "./types";

class Log {
  e(tag: string, msg: string) {
    console.error(this.formatString(tag, msg));
  }
  d(tag: string, msg: string) {
    console.debug(this.formatString(tag, msg));
  }
  w(tag: string, msg: string) {
    console.warn(this.formatString(tag, msg));
  }
  l(tag: string, msg: string) {
    console.log(this.formatString(tag, msg))
  }
  private formatString(tag: string, msg: string) {
    return `${tag} :: ${msg}`;
  }
}

class ForzaByteBuffer {
  buffer: Buffer;
  private offset: number = 0;
  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }
  getByte() {
    const val = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return val;
  }
  getInt() {
    const val = this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return val;
  }
  getLong() {
    const val = this.buffer.readUint32LE(this.offset);
    this.offset += 4;
    return val;
  }
  getShort() {
    const val = this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return val;
  }
  getFloat() {
    const val = this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return val;
  }
}

export class ForzaTelemetryApi {
  private TAG: string = "ForzaTelemetryApi";
  private static DASH_PACKET_LENGTH: number = 311;
  private static FH4_PACKET_LENGTH: number = 324;
  private static FM8_PACKET_LENGTH: number = 331;
  private buffer: ForzaByteBuffer;
  private packetLength: number = 0;
  private Log: Log;

  //#region Data Props 

  isRaceOn: boolean = false;
  timeStampMS: number = 0;
  rpmData: RpmData = {
    max: 0,
    current: 0,
    idle: 0
  };
  acceleration: DirectionalData = {
    x: 0, y: 0, z: 0
  }
  velocity: DirectionalData = {
    x: 0, y: 0, z: 0
  }
  angularVelocity: DirectionalData = {
    x: 0, y: 0, z: 0
  }
  yaw: number = 0;
  pitch: number = 0;
  roll: number = 0;
  normalizedSuspensionTravel: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  }
  tireSlipRatio: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  }
  wheelRotationSpeed: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  }
  wheelOnRumbleStrip: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  }
  wheelInPuddleDepth: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  }
  surfaceRumble: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  }
  tireSlipAngle: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  }
  tireCombinedSlip: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  }
  suspensionTravelMeters: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  }
  carInfo: CarInfo = {
    ordinalId: 0,
    carType: '',
    class: 0,
    numberOfCylinders: 0,
    performanceIndex: 0,
    drivetrainType: 0
  }
  objectHit: number = 0;
  position: DirectionalData = {
    x: 0, y: 0, z: 0
  }
  speed: number = 0;
  power: number = 0;
  torque: number = 0;
  tireTemp: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  };
  boost: number = 0;
  fuel: number = 0;
  distanceTraveled: number = 0;
  bestLap: number = 0;
  lastLap: number = 0;
  currentLap: number = 0;
  currentRaceTime: number = 0;
  lapNumber: number = 0;
  racePosition: number = 0;
  throttle: number = 0;
  brake: number = 0;
  clutch: number = 0;
  handbrake: number = 0;
  gear: number = 0;
  steer: number = 0;
  normalizedDrivingLine: number = 0;
  normalizedAIBrakeDifference: number = 0;
  tireWear: TireData = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0
  };
  trackId: number = 0;

  //#endregion

  constructor(buffLen: number, buffer: Buffer) {
    this.packetLength = buffLen;
    this.buffer = new ForzaByteBuffer(buffer);
    this.Log = new Log();
    if (!this.isForzaHorizonPacket()
      && !this.isForza7Packet()
      && !this.isForza8Packet()) {
      this.Log.w(this.TAG, `Invalid packet length ${this.packetLength}`);
    }
    this.isRaceOn = this.buffer.getInt() == 1;
    this.timeStampMS = this.buffer.getLong();
    this.rpmData.max = this.buffer.getFloat();
    this.rpmData.idle = this.buffer.getFloat();
    this.rpmData.current = this.buffer.getFloat();
    this.acceleration.x = this.buffer.getFloat() * 100;
    this.acceleration.y = this.buffer.getFloat() * 100;
    this.acceleration.z = this.buffer.getFloat() * 100;
    this.velocity.x = this.buffer.getFloat() * 100;
    this.velocity.y = this.buffer.getFloat() * 100;
    this.velocity.z = this.buffer.getFloat() * 100;
    this.angularVelocity.x = this.buffer.getFloat() * 100;
    this.angularVelocity.y = this.buffer.getFloat() * 100;
    this.angularVelocity.z = this.buffer.getFloat() * 100;
    this.yaw = this.buffer.getFloat() * 100;
    this.pitch = this.buffer.getFloat() * 100;
    this.roll = this.buffer.getFloat() * 100;
    this.normalizedSuspensionTravel.leftFront = this.buffer.getFloat() * 100;
    this.normalizedSuspensionTravel.rightFront = this.buffer.getFloat() * 100;
    this.normalizedSuspensionTravel.leftRear = this.buffer.getFloat() * 100;
    this.normalizedSuspensionTravel.rightRear = this.buffer.getFloat() * 100;
    this.tireSlipRatio.leftFront = this.buffer.getFloat() * 100;
    this.tireSlipRatio.rightFront = this.buffer.getFloat() * 100;
    this.tireSlipRatio.leftRear = this.buffer.getFloat() * 100;
    this.tireSlipRatio.rightRear = this.buffer.getFloat() * 100;
    this.wheelRotationSpeed.leftFront = this.buffer.getFloat() * 100;
    this.wheelRotationSpeed.rightFront = this.buffer.getFloat() * 100;
    this.wheelRotationSpeed.leftRear = this.buffer.getFloat() * 100;
    this.wheelRotationSpeed.rightRear = this.buffer.getFloat() * 100;
    this.wheelOnRumbleStrip.leftFront = this.buffer.getInt();
    this.wheelOnRumbleStrip.rightFront = this.buffer.getInt();
    this.wheelOnRumbleStrip.leftRear = this.buffer.getInt();
    this.wheelOnRumbleStrip.rightRear = this.buffer.getInt();
    this.wheelInPuddleDepth.leftFront = this.buffer.getFloat();
    this.wheelInPuddleDepth.rightFront = this.buffer.getFloat();
    this.wheelInPuddleDepth.leftRear = this.buffer.getFloat();
    this.wheelInPuddleDepth.rightRear = this.buffer.getFloat();
    this.surfaceRumble.leftFront = this.buffer.getFloat();
    this.surfaceRumble.rightFront = this.buffer.getFloat();
    this.surfaceRumble.leftRear = this.buffer.getFloat();
    this.surfaceRumble.rightRear = this.buffer.getFloat();
    this.tireSlipAngle.leftFront = this.buffer.getFloat();
    this.tireSlipAngle.rightFront = this.buffer.getFloat();
    this.tireSlipAngle.leftRear = this.buffer.getFloat();
    this.tireSlipAngle.rightRear = this.buffer.getFloat();
    this.tireCombinedSlip.leftFront = this.buffer.getFloat() * 100;
    this.tireCombinedSlip.rightFront = this.buffer.getFloat() * 100;
    this.tireCombinedSlip.leftRear = this.buffer.getFloat() * 100;
    this.tireCombinedSlip.rightRear = this.buffer.getFloat() * 100;
    this.suspensionTravelMeters.leftFront = this.buffer.getFloat() * 100;
    this.suspensionTravelMeters.rightFront = this.buffer.getFloat() * 100;
    this.suspensionTravelMeters.leftRear = this.buffer.getFloat() * 100;
    this.suspensionTravelMeters.rightRear = this.buffer.getFloat() * 100;
    this.carInfo.ordinalId = this.buffer.getInt();
    this.carInfo.class = this.toCarClass(this.buffer.getInt());
    this.carInfo.performanceIndex = this.buffer.getInt();
    this.carInfo.drivetrainType = this.toDrivetrain(this.buffer.getInt());
    this.carInfo.numberOfCylinders = this.buffer.getInt();
    if (this.isForzaHorizonPacket()) {
      this.carInfo.carType = this.toCarType(this.buffer.getInt());
      this.objectHit = this.buffer.getLong();
    } else {
      this.carInfo.carType = 'Not Available';
      this.objectHit = 0;
    }
    this.position.x = this.buffer.getFloat() * 100;
    this.position.y = this.buffer.getFloat() * 100;
    this.position.z = this.buffer.getFloat() * 100;
    this.speed = this.buffer.getFloat();
    this.power = this.buffer.getFloat();
    this.torque = this.buffer.getFloat();
    this.tireTemp.leftFront = this.buffer.getFloat();
    this.tireTemp.rightFront = this.buffer.getFloat();
    this.tireTemp.leftRear = this.buffer.getFloat();
    this.tireTemp.rightRear = this.buffer.getFloat();
    this.boost = this.buffer.getFloat();
    this.fuel = Math.floor(this.buffer.getFloat() * 100);
    this.distanceTraveled = this.buffer.getFloat();
    this.bestLap = this.buffer.getFloat();
    this.lastLap = this.buffer.getFloat();
    this.currentLap = this.buffer.getFloat();
    this.currentRaceTime = this.buffer.getFloat();
    this.lapNumber = this.buffer.getShort();
    this.racePosition = this.buffer.getByte();
    this.throttle = (this.buffer.getByte() & 0xff) * 100 / 255;
    this.brake = (this.buffer.getByte() & 0xff) * 100 / 255;
    this.clutch = (this.buffer.getByte() & 0xff) * 100 / 255;
    this.handbrake = (this.buffer.getByte() & 0xff) * 100 / 255;
    this.gear = (this.buffer.getByte() & 0xff);
    this.steer = (this.buffer.getByte() & 0xff) * 100 / 127;
    this.normalizedDrivingLine = (this.buffer.getByte() & 0xff) * 100 / 127;
    this.normalizedAIBrakeDifference = (this.buffer.getByte() & 0xff) * 100 / 127;
    if (this.isForza7Packet() || this.isForza8Packet()) {
      this.tireWear.leftFront = this.buffer.getFloat() * 100;
      this.tireWear.rightFront = this.buffer.getFloat() * 100;
      this.tireWear.leftRear = this.buffer.getFloat() * 100;
      this.tireWear.rightRear = this.buffer.getFloat() * 100;
    } else {
      this.tireWear.leftFront = 0;
      this.tireWear.rightFront = 0;
      this.tireWear.leftRear = 0;
      this.tireWear.rightRear = 0;
    }
  }

  toCelsius(value: number) {
    return ((value - 32) * 5) / 9;
  }
  getSpeedInKPH(): number {
    return this.speed * 3.6;
  }
  getSpeedInMPH(): number {
    return this.speed * 2.23694;
  }
  getHorsepower(): number {
    return this.power * 0.00134102;
  }

  isForzaHorizonPacket() {
    return this.packetLength == ForzaTelemetryApi.FH4_PACKET_LENGTH;
  }
  isForza8Packet() {
    return this.packetLength == ForzaTelemetryApi.FM8_PACKET_LENGTH;
  }
  isForza7Packet() {
    return this.packetLength == ForzaTelemetryApi.DASH_PACKET_LENGTH
  }
  isMotorsport() {
    return this.isForza7Packet() || this.isForza8Packet();
  }
  formatDecimal(value: number) {
    return value.toFixed(2);
  }
  toDrivetrain(value: number) {
    switch (value) {
      case 0: return Drivetrain.FWD;
      case 1: return Drivetrain.RWD;
      case 2: return Drivetrain.AWD;
    }
    return Drivetrain.FWD;
  }
  toCarClass(value: number) {
    switch (value) {
      case 0: return this.isMotorsport()
        ? CarClass.E
        : CarClass.D;
      case 1: return this.isMotorsport()
        ? CarClass.D
        : CarClass.C;
      case 2: return this.isMotorsport()
        ? CarClass.C
        : CarClass.B;
      case 3: return this.isMotorsport()
        ? CarClass.B
        : CarClass.A;
      case 4: return this.isMotorsport()
        ? CarClass.A
        : CarClass.S;
      case 5: return this.isMotorsport()
        ? CarClass.S
        : CarClass.S1;
      case 6: return this.isMotorsport()
        ? CarClass.R
        : CarClass.S2;
      case 7: return CarClass.P
    }
    return CarClass.X
  }
  toCarType(value: number) {
    let result = "Unknown (" + this.carInfo.carType + ")";
    switch (value) {
      case 11:
        result = "Modern Super Cars";
        break;
      case 12:
        result = "Retro Super Cars";
        break;
      case 13:
        result = "Hyper Cars";
        break;
      case 14:
        result = "Retro Saloons";
        break;
      case 16:
        result = "Vans & Utility";
        break;
      case 17:
        result = "Retro Sports Cars";
        break;
      case 18:
        result = "Modern Sports Cars";
        break;
      case 19:
        result = "Super Saloons";
        break;
      case 20:
        result = "Classic Racers";
        break;
      case 21:
        result = "Cult Cars";
        break;
      case 22:
        result = "Rare Classics";
        break;
      case 25:
        result = "Super Hot Hatch";
        break;
      case 29:
        result = "Rods & Customs";
        break;
      case 30:
        result = "Retro Muscle";
        break;
      case 31:
        result = "Modern Muscle";
        break;
      case 32:
        result = "Retro Rally";
        break;
      case 33:
        result = "Classic Rally";
        break;
      case 34:
        result = "Rally Monsters";
        break;
      case 35:
        result = "Modern Rally";
        break;
      case 36:
        result = "GT Cars";
        break;
      case 37:
        result = "Super GT";
        break;
      case 38:
        result = "Extreme Offroad";
        break;
      case 39:
        result = "Sports Utility Heroes";
        break;
      case 40:
        result = "Offroad";
        break;
      case 41:
        result = "Offroad Buggies";
        break;
      case 42:
        result = "Classic Sports Cars";
        break;
      case 43:
        result = "Track Toys";
        break;
      case 44:
        result = "Vintage Racers";
        break;
      case 45:
        result = "Trucks";
        break;
    }
    return result;
  }
}