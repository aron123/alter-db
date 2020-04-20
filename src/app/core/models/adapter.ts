export interface Adapter<T> {
    adapt(obj: any): T;
}
