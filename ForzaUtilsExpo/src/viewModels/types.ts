
/**
 * Add type for generic axle data
 * @template T Type of data for the axle
 * @property front Data for the front axle
 * @property rear Data for the rear axle
 */
export interface AxleData<T> {
  front: T;
  rear: T;
}