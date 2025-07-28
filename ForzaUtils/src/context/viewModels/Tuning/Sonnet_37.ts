import { Drivetrain } from "ForzaTelemetryApi";
import { AxleData } from "../../../constants/types";
import { ITuningCalculator, CalculatorParams, CalculatorResult, hzBase, EngineLayout, hzHighHeight, hzLowHeight } from "./Calculators";

/**
 * SonnetCalculator - Physics-based suspension tuning calculator for Forza Motorsport
 * Uses automotive engineering principles to generate optimal suspension settings
 */
export class SonnetCalculator implements ITuningCalculator {
    // Physics constants
    private readonly GRAVITY = 9.81; // m/s²
    private readonly LBS_TO_KG = 0.453592;
    private readonly KG_TO_LBS = 2.20462;
    private readonly N_M_TO_LB_IN = 0.00571015; // 1 N/m = 0.00571015 lb/in
    private readonly LB_IN_TO_N_M = 175.127; // 1 lb/in = 175.127 N/m
    
    // Damping ratios (based on racing suspension engineering)
    private readonly BOUND_RATIO = 0.30; // 30% of critical damping for compression
    private readonly REBOUND_RATIO = 0.55; // 55% of critical damping for rebound
    
    // Roll cage effect - reduces ARB stiffness needed due to increased chassis rigidity
    private readonly ROLL_CAGE_STIFFNESS_FACTOR = 0.85; // 15% reduction in ARB when roll cage is present
    
    // Weight transfer coefficients by drivetrain and engine layout
    private readonly WEIGHT_TRANSFER = {
        [EngineLayout.FRONT]: {
            [Drivetrain.FWD]: { front: 0.58, rear: 0.42 },
            [Drivetrain.RWD]: { front: 0.53, rear: 0.47 },
            [Drivetrain.AWD]: { front: 0.51, rear: 0.49 }
        },
        [EngineLayout.MID]: {
            [Drivetrain.FWD]: { front: 0.55, rear: 0.45 },
            [Drivetrain.RWD]: { front: 0.48, rear: 0.52 },
            [Drivetrain.AWD]: { front: 0.50, rear: 0.50 }
        },
        [EngineLayout.REAR]: {
            [Drivetrain.FWD]: { front: 0.53, rear: 0.47 },
            [Drivetrain.RWD]: { front: 0.42, rear: 0.58 },
            [Drivetrain.AWD]: { front: 0.47, rear: 0.53 }
        }
    };

    /**
     * Main calculation method - implements ITuningCalculator interface
     */
    calculate(params: CalculatorParams): CalculatorResult {
        // 1. Calculate weight distribution
        const weights = this.calculateWeightDistribution(
            params.totalWeight,
            params.frontWeightDistribution,
            params.engineLayout,
            params.drivetrain
        );
        
        // 2. Determine target suspension frequency
        const targetHz = params.suspensionHz || {
            front: this.calculateHzFromRideHeight(params.rideHeight.front),
            rear: this.calculateHzFromRideHeight(params.rideHeight.rear)
        };
        
        // 3. Calculate spring rates using physics formula k = (2πf)² × m
        const springRates = this.calculateSpringRates(
            weights.axle,
            targetHz,
            params.rideHeight,
            params.frontAeroForce || 0,
            params.rearAeroForce || 0
        );
        
        // 4. Calculate dampers based on critical damping theory
        const dampers = this.calculateDampers(springRates, weights.axle);
        
        // 5. Calculate anti-roll bars
        const antiRollBar = this.calculateAntiRollBars(
            springRates,
            weights.axle,
            params.frontWeightDistribution,
            params.hasRollCage
        );
        
        // 6. Return complete tuning setup
        return {
            springRates,
            damperBound: dampers.bound,
            damperRebound: dampers.rebound,
            antiRollBar,
            axleWeights: weights.axle,
            cornerWeights: weights.corner
        };
    }

    /**
     * Calculates natural frequency from ride height when not specified
     * Required by ITuningCalculator interface
     */
    calculateHzFromRideHeight(height: number): number {
        if (isNaN(height) || height <= 0) return hzBase;
        if (height <= 4.5) return hzLowHeight;
        if (height >= 6.0) return hzHighHeight;
        
        // Linear interpolation for heights between 4.5 and 6.0
        const t = (height - 4.5) / 1.5;
        return +(hzLowHeight - (hzLowHeight - hzHighHeight) * t).toFixed(3);
    }

    /**
     * Calculate weight distribution considering both static and dynamic factors
     */
    private calculateWeightDistribution(
        totalWeight: number,
        frontDistributionPercent: number,
        engineLayout?: EngineLayout,
        drivetrain?: Drivetrain
    ): { 
        axle: AxleData<number>; 
        corner: AxleData<number> 
    } {
        // Calculate static weight distribution (based on percentage)
        const frontAxlePercent = frontDistributionPercent / 100;
        const rearAxlePercent = 1 - frontAxlePercent;
        
        const frontAxleStatic = totalWeight * frontAxlePercent;
        const rearAxleStatic = totalWeight * rearAxlePercent;
        
        // Get dynamic weight transfer coefficient based on layout and drivetrain
        const transfer = engineLayout !== undefined && drivetrain !== undefined
            ? this.WEIGHT_TRANSFER[engineLayout][drivetrain]
            : { front: 0.5, rear: 0.5 };
        
        // Calculate dynamic weight distribution (during cornering/acceleration)
        const frontAxleDynamic = totalWeight * transfer.front;
        const rearAxleDynamic = totalWeight * transfer.rear;
        
        // Blend static and dynamic (70% static, 30% dynamic) for realistic setup
        const frontAxle = frontAxleStatic * 0.7 + frontAxleDynamic * 0.3;
        const rearAxle = rearAxleStatic * 0.7 + rearAxleDynamic * 0.3;
        
        return {
            axle: {
                front: Math.round(frontAxle),
                rear: Math.round(rearAxle)
            },
            corner: {
                front: Math.round(frontAxle / 2),
                rear: Math.round(rearAxle / 2)
            }
        };
    }

    /**
     * Calculate spring rates using the physics formula: k = (2πf)² × m
     */
    private calculateSpringRates(
        axleWeight: AxleData<number>,
        frequency: AxleData<number>,
        rideHeight: AxleData<number>,
        frontAero: number,
        rearAero: number
    ): AxleData<number> {
        // Convert weights to kg and add aero downforce
        const frontMass = (axleWeight.front + frontAero) * this.LBS_TO_KG;
        const rearMass = (axleWeight.rear + rearAero) * this.LBS_TO_KG;
        
        // Calculate spring rates in N/m using formula k = (2πf)² × m
        // Using mass per wheel (half axle weight)
        const frontSpringRate = 4 * Math.PI * Math.PI * frequency.front * frequency.front * (frontMass / 2);
        const rearSpringRate = 4 * Math.PI * Math.PI * frequency.rear * frequency.rear * (rearMass / 2);
        
        // Ride height correction - lower cars need slightly stiffer springs
        const heightFactor = {
            front: Math.pow(5.0 / Math.max(4.0, rideHeight.front), 0.4),
            rear: Math.pow(5.0 / Math.max(4.0, rideHeight.rear), 0.4)
        };
        
        // Convert from N/m to lb/in for Forza
        const frontSpringLbIn = frontSpringRate * this.N_M_TO_LB_IN * heightFactor.front;
        const rearSpringLbIn = rearSpringRate * this.N_M_TO_LB_IN * heightFactor.rear;
        
        return {
            front: Math.round(frontSpringLbIn),
            rear: Math.round(rearSpringLbIn)
        };
    }

    /**
     * Calculate damper settings using critical damping theory
     */
    private calculateDampers(
        springs: AxleData<number>,
        axleWeight: AxleData<number>
    ): { 
        bound: AxleData<number>; 
        rebound: AxleData<number> 
    } {
        // Convert spring rates from lb/in to N/m
        const frontSpringNm = springs.front * this.LB_IN_TO_N_M;
        const rearSpringNm = springs.rear * this.LB_IN_TO_N_M;
        
        // Convert weight from lbs to kg (per wheel)
        const frontMassKg = (axleWeight.front * this.LBS_TO_KG) / 2;
        const rearMassKg = (axleWeight.rear * this.LBS_TO_KG) / 2;
        
        // Calculate critical damping coefficient: c_crit = 2 * sqrt(k * m)
        const frontCriticalDamping = 2 * Math.sqrt(frontSpringNm * frontMassKg);
        const rearCriticalDamping = 2 * Math.sqrt(rearSpringNm * rearMassKg);
        
        // Calculate actual damping coefficients using ratios
        const boundDamping = {
            front: frontCriticalDamping * this.BOUND_RATIO,
            rear: rearCriticalDamping * this.BOUND_RATIO
        };
        
        const reboundDamping = {
            front: frontCriticalDamping * this.REBOUND_RATIO,
            rear: rearCriticalDamping * this.REBOUND_RATIO
        };
        
        // Map physical damping values to Forza's 1-14 scale
        // Use the same real-world range for both to maintain proper relationship
        return {
            bound: this.mapToGameRange(boundDamping, 200, 8000, 1, 14),
            rebound: this.mapToGameRange(reboundDamping, 200, 8000, 1, 14)
        };
    }

    /**
     * Calculate anti-roll bar settings based on spring rates and weight
     */
    private calculateAntiRollBars(
        springs: AxleData<number>,
        axleWeight: AxleData<number>,
        frontWeightPercent: number,
        hasRollCage: boolean
    ): AxleData<number> {
        // Calculate total weight for reference
        const totalWeight = axleWeight.front + axleWeight.rear;
        
        // Base ARB ratio - typical proportion of spring rate
        const baseArbRatio = 0.35; // 35% of spring rate
        
        // Calculate base ARB values
        let arbRates = {
            front: springs.front * baseArbRatio,
            rear: springs.rear * baseArbRatio
        };
        
        // Weight factor based on actual axle weights
        // Heavier axles need proportionally stiffer ARBs to control roll
        const weightFactor = {
            // Use actual axle weights with normalization by half of total weight
            front: Math.pow(axleWeight.front / (totalWeight/2), 1.3),
            rear: Math.pow(axleWeight.rear / (totalWeight/2), 1.3)
        };
        
        // Apply weight factor
        arbRates.front *= weightFactor.front;
        arbRates.rear *= weightFactor.rear;
        
        // Apply roll cage factor from class constant if present
        if (hasRollCage) {
            arbRates.front *= this.ROLL_CAGE_STIFFNESS_FACTOR;
            arbRates.rear *= this.ROLL_CAGE_STIFFNESS_FACTOR;
        }
        
        // Add additional adjustments based on weight distribution percentages
        // For fine-tuning balance beyond the actual weights
        const distributionBalance = {
            front: Math.pow(frontWeightPercent / 50, 0.5),
            rear: Math.pow((100 - frontWeightPercent) / 50, 0.5)
        };
        
        // Apply distribution balance adjustment (milder effect)
        arbRates.front *= distributionBalance.front;
        arbRates.rear *= distributionBalance.rear;
        
        // Narrower, more realistic mapping range
        return this.mapToGameRange(arbRates, 100, 700, 1, 35);
    }

    /**
     * Map real-world values to Forza's game scales
     */
    private mapToGameRange(
        values: AxleData<number>,
        realMin: number,
        realMax: number,
        gameMin: number,
        gameMax: number
    ): AxleData<number> {
        const mapValue = (value: number): number => {
            // Clamp to real-world range
            const clampedValue = Math.max(realMin, Math.min(realMax, value));
            
            // Normalize to 0-1 range
            const normalizedValue = (clampedValue - realMin) / (realMax - realMin);
            
            // Map to game range
            return Math.round(gameMin + normalizedValue * (gameMax - gameMin));
        };
        
        return {
            front: mapValue(values.front),
            rear: mapValue(values.rear)
        };
    }
}